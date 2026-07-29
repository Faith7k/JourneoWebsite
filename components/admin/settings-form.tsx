'use client';

import { useState } from 'react';
import {
  Loader2,
  Save,
  Check,
  Store,
  Mail,
  Share2,
  Shield,
  ExternalLink,
  MapPin,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { SiteSettings } from '@/lib/supabase/types';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ja', label: '日本語' },
  { code: 'ar', label: 'العربية' },
  { code: 'zh', label: '中文' },
] as const;

type Props = { initial: SiteSettings | null };

export function SettingsForm({ initial }: Props) {
  const [form, setForm] = useState({
    app_store_url: initial?.app_store_url ?? '',
    play_store_url: initial?.play_store_url ?? '',
    support_email: initial?.support_email ?? '',
    press_email: initial?.press_email ?? '',
    phone: initial?.phone ?? '',
    address: initial?.address ?? '',
    twitter_url: initial?.twitter_url ?? '',
    instagram_url: initial?.instagram_url ?? '',
    linkedin_url: initial?.linkedin_url ?? '',
    privacy_policy_url: initial?.privacy_policy_url ?? '',
    terms_of_service_url: initial?.terms_of_service_url ?? '',
    privacy_policy_text_tr: initial?.privacy_policy_text_tr ?? '',
    privacy_policy_text_en: initial?.privacy_policy_text_en ?? '',
    privacy_policy_text_es: initial?.privacy_policy_text_es ?? '',
    privacy_policy_text_fr: initial?.privacy_policy_text_fr ?? '',
    privacy_policy_text_de: initial?.privacy_policy_text_de ?? '',
    privacy_policy_text_ja: initial?.privacy_policy_text_ja ?? '',
    privacy_policy_text_ar: initial?.privacy_policy_text_ar ?? '',
    privacy_policy_text_zh: initial?.privacy_policy_text_zh ?? '',
    terms_of_service_text_tr: initial?.terms_of_service_text_tr ?? '',
    terms_of_service_text_en: initial?.terms_of_service_text_en ?? '',
    terms_of_service_text_es: initial?.terms_of_service_text_es ?? '',
    terms_of_service_text_fr: initial?.terms_of_service_text_fr ?? '',
    terms_of_service_text_de: initial?.terms_of_service_text_de ?? '',
    terms_of_service_text_ja: initial?.terms_of_service_text_ja ?? '',
    terms_of_service_text_ar: initial?.terms_of_service_text_ar ?? '',
    terms_of_service_text_zh: initial?.terms_of_service_text_zh ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const updateTextarea = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || 'Failed to save settings.');
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {saved && (
        <Alert className="border-emerald-800/50 bg-emerald-500/10 text-emerald-300">
          <Check className="h-4 w-4" />
          <AlertDescription>Settings saved successfully.</AlertDescription>
        </Alert>
      )}

      {/* Store URLs */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/20">
              <Store className="h-4 w-4 text-blue-400" />
            </div>
            App Store Links
          </CardTitle>
          <CardDescription className="text-slate-400">
            These URLs power the download buttons on the landing page.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <UrlField
            label="App Store URL"
            value={form.app_store_url}
            onChange={update('app_store_url')}
            placeholder="https://apps.apple.com/app/..."
          />
          <UrlField
            label="Play Store URL"
            value={form.play_store_url}
            onChange={update('play_store_url')}
            placeholder="https://play.google.com/store/apps/..."
          />
        </CardContent>
      </Card>

      {/* Legal Links */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-500/20">
              <Shield className="h-4 w-4 text-purple-400" />
            </div>
            Legal Links
          </CardTitle>
          <CardDescription className="text-slate-400">
            Required by App Store and Google Play — these links are shown in the app and on the
            site footer. Use full URLs (e.g.{' '}
            <code className="rounded bg-slate-800 px-1 text-xs">https://journeo.app/privacy</code>
            ).
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <UrlField
            label="Privacy Policy URL"
            value={form.privacy_policy_url}
            onChange={update('privacy_policy_url')}
            placeholder="https://journeo.app/privacy"
            required
          />
          <UrlField
            label="Terms of Service URL"
            value={form.terms_of_service_url}
            onChange={update('terms_of_service_url')}
            placeholder="https://journeo.app/terms"
            required
          />
        </CardContent>
      </Card>

      {/* Legal Contents */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-500/20">
              <Shield className="h-4 w-4 text-purple-400" />
            </div>
            Privacy Policy Content
          </CardTitle>
          <CardDescription className="text-slate-400">
            Enter the actual text content of your Privacy Policy. If empty, the website will use default system translations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="en" className="w-full">
            <TabsList className="mb-4 flex flex-wrap h-auto gap-2 p-1 bg-transparent justify-start">
              {LANGUAGES.map((lang) => (
                <TabsTrigger key={lang.code} value={lang.code} className="bg-slate-800/50 data-[state=active]:bg-slate-700">
                  {lang.label} ({lang.code.toUpperCase()})
                </TabsTrigger>
              ))}
            </TabsList>
            {LANGUAGES.map((lang) => (
              <TabsContent key={lang.code} value={lang.code}>
                <TextareaField
                  label={`Privacy Policy (${lang.code.toUpperCase()})`}
                  value={form[`privacy_policy_text_${lang.code}` as keyof typeof form]}
                  onChange={updateTextarea(`privacy_policy_text_${lang.code}` as keyof typeof form)}
                  placeholder={`Enter privacy policy text in ${lang.label}...`}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-500/20">
              <Shield className="h-4 w-4 text-purple-400" />
            </div>
            Terms of Service Content
          </CardTitle>
          <CardDescription className="text-slate-400">
            Enter the actual text content of your Terms of Service. If empty, the website will use default system translations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="en" className="w-full">
            <TabsList className="mb-4 flex flex-wrap h-auto gap-2 p-1 bg-transparent justify-start">
              {LANGUAGES.map((lang) => (
                <TabsTrigger key={lang.code} value={lang.code} className="bg-slate-800/50 data-[state=active]:bg-slate-700">
                  {lang.label} ({lang.code.toUpperCase()})
                </TabsTrigger>
              ))}
            </TabsList>
            {LANGUAGES.map((lang) => (
              <TabsContent key={lang.code} value={lang.code}>
                <TextareaField
                  label={`Terms of Service (${lang.code.toUpperCase()})`}
                  value={form[`terms_of_service_text_${lang.code}` as keyof typeof form]}
                  onChange={updateTextarea(`terms_of_service_text_${lang.code}` as keyof typeof form)}
                  placeholder={`Enter terms of service text in ${lang.label}...`}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/20">
              <Mail className="h-4 w-4 text-emerald-400" />
            </div>
            Contact Info
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Support email"
            value={form.support_email}
            onChange={update('support_email')}
            placeholder="support@journeo.app"
          />
          <Field
            label="Press email"
            value={form.press_email}
            onChange={update('press_email')}
            placeholder="press@journeo.app"
          />
          <Field
            label="Phone"
            value={form.phone}
            onChange={update('phone')}
            placeholder="+90 ..."
            icon={<Phone className="h-3.5 w-3.5 text-slate-500" />}
          />
          <Field
            label="Address"
            value={form.address}
            onChange={update('address')}
            placeholder="Istanbul, Turkey"
            icon={<MapPin className="h-3.5 w-3.5 text-slate-500" />}
          />
        </CardContent>
      </Card>

      {/* Social */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-pink-500/20">
              <Share2 className="h-4 w-4 text-pink-400" />
            </div>
            Social Media
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <UrlField
            label="Twitter / X"
            value={form.twitter_url}
            onChange={update('twitter_url')}
            placeholder="https://x.com/journeoapp"
          />
          <UrlField
            label="Instagram"
            value={form.instagram_url}
            onChange={update('instagram_url')}
            placeholder="https://instagram.com/journeoapp"
          />
          <UrlField
            label="LinkedIn"
            value={form.linkedin_url}
            onChange={update('linkedin_url')}
            placeholder="https://linkedin.com/company/journeo"
          />
        </CardContent>
      </Card>

      <Button
        onClick={handleSave}
        disabled={saving}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500"
      >
        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        {saving ? 'Saving…' : 'Save settings'}
      </Button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  icon,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-slate-300">{label}</Label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
        )}
        <Input
          value={value}
          onChange={onChange}
          className={`border-slate-700 bg-slate-800/50 text-slate-100 placeholder:text-slate-600 ${icon ? 'pl-8' : ''}`}
          placeholder={placeholder ?? `Enter ${label.toLowerCase()}`}
        />
      </div>
    </div>
  );
}

function UrlField({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const isValidUrl = value.startsWith('http://') || value.startsWith('https://');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm text-slate-300">
          {label}
          {required && <span className="ml-1 text-purple-400">*</span>}
        </Label>
        {value && isValidUrl && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
          >
            Preview <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
      <Input
        value={value}
        onChange={onChange}
        className="border-slate-700 bg-slate-800/50 text-slate-100 placeholder:text-slate-600"
        placeholder={placeholder ?? `https://...`}
      />
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 8,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-slate-300">{label}</Label>
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full rounded-md border border-slate-700 bg-slate-800/50 p-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
        placeholder={placeholder}
      />
    </div>
  );
}