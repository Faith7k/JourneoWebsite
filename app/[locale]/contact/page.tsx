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
    <div className="py-24">
      <div className="container max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold">{t('title')}</h1>
          <p className="text-xl text-muted-foreground">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Mail className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Email</CardTitle>
                <CardDescription>support@journeo.ai</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Address</CardTitle>
                <CardDescription>
                  Istanbul, Turkey
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Send className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Response Time</CardTitle>
                <CardDescription>
                  We typically respond within 24-48 hours
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('title')}</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you soon.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('name')}</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('email')}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t('message')}</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      placeholder="Your message..."
                    />
                  </div>

                  {status.type && (
                    <Alert variant={status.type === 'error' ? 'destructive' : 'default'}>
                      <AlertDescription>{status.message}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
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

