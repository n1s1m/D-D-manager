import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const APIFREE_URL = 'https://api.apifree.ai/v1/chat/completions';
const API_KEY = process.env.APIFREE_API_KEY;

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!API_KEY) {
    return NextResponse.json(
      { error: 'Chat API is not configured (APIFREE_API_KEY missing)' },
      { status: 503 }
    );
  }

  let body: { characterId?: string; situation?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { characterId, situation } = body;
  if (!characterId || typeof situation !== 'string') {
    return NextResponse.json(
      { error: 'characterId and situation are required' },
      { status: 400 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: character, error: charError } = await supabase
    .from('characters')
    .select('id, name, description, background, notes')
    .eq('id', characterId)
    .single();

  if (charError || !character) {
    return NextResponse.json({ error: 'Character not found' }, { status: 404 });
  }

  const description = character.description?.trim() || '';
  const background = character.background?.trim() || '';
  const notes = character.notes?.trim() || '';
  const situationTrimmed = situation.trim();
  if (!situationTrimmed) {
    return NextResponse.json(
      { error: 'Situation cannot be empty' },
      { status: 400 }
    );
  }

  const systemParts: string[] = [
    `You are helping a player decide how their D&D character "${character.name}" would act in a given situation.`,
    'Respond with 2–4 short, in-character ideas: what the character might say, do, or feel. Keep tone consistent with the character.',
  ];
  if (description) systemParts.push(`Character description: ${description}`);
  if (background) systemParts.push(`Background: ${background}`);
  if (notes) systemParts.push(`Player notes: ${notes}`);

  const userMessage = `Situation: ${situationTrimmed}\n\nWhat would my character do?`;

  const messages: { role: string; content: string }[] = [
    { role: 'system', content: systemParts.join('\n\n') },
    { role: 'user', content: userMessage },
  ];

  try {
    const res = await axios.post<{
      choices?: Array<{ message?: { content?: string } }>;
    }>(
      APIFREE_URL,
      {
        model: 'openai/gpt-5.2',
        max_tokens: 4096,
        stream: false,
        messages,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const content = res.data.choices?.[0]?.message?.content?.trim() ?? '';
    return NextResponse.json({ text: content });
  } catch (err: unknown) {
    const axErr = axios.isAxiosError(err) ? err : null;
    if (axErr?.response) {
      const status = axErr.response.status;
      const errData = axErr.response.data;
      const errText = typeof errData === 'string' ? errData : JSON.stringify(errData ?? '');
      console.error('Apifree API error:', status, errText);
      let message = `Chat API error (${status})`;
      try {
        const errJson = typeof errData === 'object' && errData !== null
          ? (errData as { error?: { message?: string }; message?: string })
          : JSON.parse(errText);
        const detail = errJson?.error?.message ?? errJson?.message ?? errText.slice(0, 200);
        if (detail) message = detail;
      } catch {
        if (errText) message = errText.slice(0, 200);
      }
      return NextResponse.json({ error: message }, { status: 502 });
    }
    const message =
      err instanceof Error ? err.message : 'Network or server error';
    console.error('Chat API error:', message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
