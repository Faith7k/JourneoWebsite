'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, MapPin, Send } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ContactPage() {
  const t = useTranslations('contact');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus({ type: 'success', message: t('success') });
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus({ type: 'error', message: t('error') });
      }
    } catch (error) {
      setStatus({ type: 'error', message: t('error') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAF7F2] py-24">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[#FAF7F2]" />
      <div className="absolute inset-0 bg-map-grid opacity-100" />
      
      {/* Topographic Contours SVGs */}
      <svg className="absolute -left-10 top-10 w-[500px] h-[500px] text-amber-900/[0.035] pointer-events-none" viewBox="0 0 100 100" fill="none">
        <path className="map-contour" d="M-20,10 C15,-5 25,25 35,50 C45,75 75,85 120,90" />
        <path className="map-contour" d="M-20,25 C20,10 30,40 40,65 C50,90 85,100 130,105" />
      </svg>
      <svg className="absolute -right-20 bottom-10 w-[500px] h-[500px] text-amber-900/[0.035] pointer-events-none" viewBox="0 0 100 100" fill="none">
        <path className="map-contour" d="M30,120 C40,90 70,80 85,55 C100,30 80,10 120,-20" />
        <path className="map-contour" d="M15,120 C25,80 60,70 75,45 C90,20 70,0 110,-30" />
      </svg>

      <div className="container relative z-10 max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h1 className="heading-modern text-gradient">{t('title')}</h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="bg-white/85 backdrop-blur-sm border border-amber-900/10 shadow-md">
              <CardHeader>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-2">
                  <Mail className="h-6 w-6 text-amber-700" />
                </div>
                <CardTitle className="text-stone-900">Email</CardTitle>
                <CardDescription className="text-stone-600">support@journeo.ai</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/85 backdrop-blur-sm border border-amber-900/10 shadow-md">
              <CardHeader>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-2">
                  <MapPin className="h-6 w-6 text-amber-700" />
                </div>
                <CardTitle className="text-stone-900">Address</CardTitle>
                <CardDescription className="text-stone-600">
                  Istanbul, Turkey
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/85 backdrop-blur-sm border border-amber-900/10 shadow-md">
              <CardHeader>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-2">
                  <Send className="h-6 w-6 text-amber-700" />
                </div>
                <CardTitle className="text-stone-900">Response Time</CardTitle>
                <CardDescription className="text-stone-600">
                  We typically respond within 24-48 hours
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/85 backdrop-blur-sm border border-amber-900/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-stone-900">{t('title')}</CardTitle>
                <CardDescription className="text-stone-600">
                  Fill out the form below and we'll get back to you soon.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-stone-700">{t('name')}</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="John Doe"
                      className="bg-white/80 border-amber-900/15 focus:border-amber-600 focus:ring-amber-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-stone-700">{t('email')}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="john@example.com"
                      className="bg-white/80 border-amber-900/15 focus:border-amber-600 focus:ring-amber-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-stone-700">{t('message')}</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      placeholder="Your message..."
                      className="bg-white/80 border-amber-900/15 focus:border-amber-600 focus:ring-amber-500/20"
                    />
                  </div>

                  {status.type && (
                    <Alert variant={status.type === 'error' ? 'destructive' : 'default'}>
                      <AlertDescription>{status.message}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" size="lg" className="btn-modern w-full" disabled={loading}>
                    {loading ? t('sending') : t('send')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

