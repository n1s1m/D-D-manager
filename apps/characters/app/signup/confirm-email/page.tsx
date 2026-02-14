'use client';

import Link from 'next/link';
import { Mail } from 'lucide-react';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@repo/ui-components';

export default function ConfirmEmailPage() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-center text-2xl">Confirm your email</CardTitle>
          <CardDescription className="text-center">
            We&apos;ve sent you a confirmation link. Please check your inbox and click the link to verify your email address. Once confirmed, you can sign in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground">
          <p>Didn&apos;t receive the email? Check your spam folder or try signing up again with the same email.</p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/login">Go to sign in</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/">Back to home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
