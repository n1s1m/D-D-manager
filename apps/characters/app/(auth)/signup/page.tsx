'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { supabase } from 'supabase-client';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from '@repo/ui-components';
import { Chrome } from 'lucide-react';
import { signupSchema, type SignupFormValues } from '@/lib/validations/auth';
import {
  FormTextField,
  FormEmailField,
  FormPasswordField,
} from '@/lib/form-fields';

const defaultValues: SignupFormValues = {
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
};

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignupFormValues>({
    defaultValues,
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name || data.email.split('@')[0],
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        router.push('/signup/confirm-email');
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (oauthError) throw oauthError;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  const { control, formState: { errors } } = form;

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl">D&D Manager</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <FormTextField<SignupFormValues>
              control={control}
              name="name"
              label="Name"
              placeholder="Your name"
              error={errors.name?.message}
              optional
            />
            <FormEmailField<SignupFormValues>
              control={control}
              name="email"
              label="Email"
              placeholder="you@example.com"
              error={errors.email?.message}
              autoComplete="email"
            />
            <FormPasswordField<SignupFormValues>
              control={control}
              name="password"
              label="Password"
              placeholder="••••••••"
              error={errors.password?.message}
              autoComplete="new-password"
            />
            <FormPasswordField<SignupFormValues>
              control={control}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              autoComplete="new-password"
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleOAuthSignIn}
                disabled={loading}
                className="w-full"
              >
                <Chrome className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
