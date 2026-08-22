'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, Lock, Mail, ShieldAlert } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/admingate';
  const errorCode = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.replace(redirect);
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 antialiased">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Journeo Logo"
              width={44}
              height={44}
              className="w-11 h-11 rounded-xl shadow-sm object-cover border border-slate-200"
            />
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Journeo
            </span>
          </Link>
          <p className="mt-2 text-sm text-slate-500 font-medium">Yönetici Giriş Paneli</p>
        </div>

        <Card className="border-slate-200/80 bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-slate-900">Yönetici Girişi</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Yönetici hesabınızla kontrol paneline erişin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorCode === 'unauthorized' && (
              <Alert variant="destructive" className="mb-4 bg-rose-50 border-rose-200 text-rose-800">
                <ShieldAlert className="h-4 w-4 text-rose-600" />
                <AlertDescription className="text-xs">
                  Hesabınız admin paneline erişim yetkisine sahip değil.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="mb-4 bg-rose-50 border-rose-200 text-rose-800">
                <ShieldAlert className="h-4 w-4 text-rose-600" />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                  E-posta
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@journeo.ai"
                    className="border-slate-200 bg-white pl-10 text-slate-900 placeholder:text-slate-400 text-sm"
                    autoComplete="email"
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                  Şifre
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="border-slate-200 bg-white pl-10 text-slate-900 placeholder:text-slate-400 text-sm"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-xs transition-colors"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Giriş yapılıyor…' : 'Giriş Yap'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-slate-400">
          Yalnızca yetkili personel içindir. Tüm erişim ve işlemler loglanmaktadır.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
