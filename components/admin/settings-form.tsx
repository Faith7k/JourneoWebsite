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
  CheckCircle2,
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
        setError(data.error || 'Ayarlar kaydedilirken hata oluştu.');
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata meydana geldi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {error && (
        <Alert variant="destructive" className="rounded-2xl border-rose-200 bg-rose-50 text-rose-800 font-semibold">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {saved && (
        <Alert className="rounded-2xl border-emerald-200 bg-emerald-50 text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <AlertDescription>Ayarlar başarıyla güncellendi.</AlertDescription>
        </Alert>
      )}

      {/* Store URLs */}
      <Card className="border border-slate-200/80 bg-white shadow-2xs rounded-2xl">
        <CardHeader className="pb-3 border-b border-slate-100/80">
          <CardTitle className="flex items-center gap-3 text-base font-bold text-slate-900">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Store className="h-4.5 w-4.5" />
            </div>
            Uygulama Mağazası Linkleri
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Bu URL&apos;ler ana sayfadaki ve indirme butonlarındaki yönlendirmeleri yönetir.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-5 grid gap-5 sm:grid-cols-2">
          <UrlField
            label="App Store URL (iOS)"
            value={form.app_store_url}
            onChange={update('app_store_url')}
            placeholder="https://apps.apple.com/app/..."
          />
          <UrlField
            label="Google Play Store URL (Android)"
            value={form.play_store_url}
            onChange={update('play_store_url')}
            placeholder="https://play.google.com/store/apps/..."
          />
        </CardContent>
      </Card>

      {/* Legal Links */}
      <Card className="border border-slate-200/80 bg-white shadow-2xs rounded-2xl">
        <CardHeader className="pb-3 border-b border-slate-100/80">
          <CardTitle className="flex items-center gap-3 text-base font-bold text-slate-900">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <Shield className="h-4.5 w-4.5" />
            </div>
            Yasal Belgeler & URL Bağlantıları
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            App Store ve Google Play tarafından zorunlu kılınan yasal sayfaların harici veya dahili linkleri.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-5 grid gap-5 sm:grid-cols-2">
          <UrlField
            label="Gizlilik Politikası URL"
            value={form.privacy_policy_url}
            onChange={update('privacy_policy_url')}
            placeholder="https://journeo.ai/privacy"
            required
          />
          <UrlField
            label="Kullanım Koşulları URL"
            value={form.terms_of_service_url}
            onChange={update('terms_of_service_url')}
            placeholder="https://journeo.ai/terms"
            required
          />
        </CardContent>
      </Card>

      {/* Legal Contents */}
      <Card className="border border-slate-200/80 bg-white shadow-2xs rounded-2xl">
        <CardHeader className="pb-3 border-b border-slate-100/80">
          <CardTitle className="flex items-center gap-3 text-base font-bold text-slate-900">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <Shield className="h-4.5 w-4.5" />
            </div>
            Gizlilik Politikası Metin İçerikleri
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Özel bir gizlilik sözleşmesi metni girin. Boş bırakıldığında varsayılan sistem çevirisi kullanılır.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-5">
          <Tabs defaultValue="tr" className="w-full">
            <TabsList className="mb-4 flex flex-wrap h-auto gap-1.5 p-1 bg-slate-100/80 border border-slate-200/60 rounded-xl justify-start">
              {LANGUAGES.map((lang) => (
                <TabsTrigger
                  key={lang.code}
                  value={lang.code}
                  className="text-xs font-bold rounded-lg px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-2xs"
                >
                  {lang.label} ({lang.code.toUpperCase()})
                </TabsTrigger>
              ))}
            </TabsList>
            {LANGUAGES.map((lang) => (
              <TabsContent key={lang.code} value={lang.code}>
                <TextareaField
                  label={`Gizlilik Politikası (${lang.label})`}
                  value={form[`privacy_policy_text_${lang.code}` as keyof typeof form]}
                  onChange={updateTextarea(`privacy_policy_text_${lang.code}` as keyof typeof form)}
                  placeholder={`${lang.label} dilinde gizlilik politikası metnini girin...`}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card className="border border-slate-200/80 bg-white shadow-2xs rounded-2xl">
        <CardHeader className="pb-3 border-b border-slate-100/80">
          <CardTitle className="flex items-center gap-3 text-base font-bold text-slate-900">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <Shield className="h-4.5 w-4.5" />
            </div>
            Kullanım Koşulları Metin İçerikleri
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Özel bir kullanım şartları metni girin. Boş bırakıldığında varsayılan sistem çevirisi kullanılır.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-5">
          <Tabs defaultValue="tr" className="w-full">
            <TabsList className="mb-4 flex flex-wrap h-auto gap-1.5 p-1 bg-slate-100/80 border border-slate-200/60 rounded-xl justify-start">
              {LANGUAGES.map((lang) => (
                <TabsTrigger
                  key={lang.code}
                  value={lang.code}
                  className="text-xs font-bold rounded-lg px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-2xs"
                >
                  {lang.label} ({lang.code.toUpperCase()})
                </TabsTrigger>
              ))}
            </TabsList>
            {LANGUAGES.map((lang) => (
              <TabsContent key={lang.code} value={lang.code}>
                <TextareaField
                  label={`Kullanım Koşulları (${lang.label})`}
                  value={form[`terms_of_service_text_${lang.code}` as keyof typeof form]}
                  onChange={updateTextarea(`terms_of_service_text_${lang.code}` as keyof typeof form)}
                  placeholder={`${lang.label} dilinde kullanım koşulları metnini girin...`}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="border border-slate-200/80 bg-white shadow-2xs rounded-2xl">
        <CardHeader className="pb-3 border-b border-slate-100/80">
          <CardTitle className="flex items-center gap-3 text-base font-bold text-slate-900">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Mail className="h-4.5 w-4.5" />
            </div>
            İletişim & Kurumsal Bilgiler
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5 grid gap-5 sm:grid-cols-2">
          <Field
            label="Destek E-postası"
            value={form.support_email}
            onChange={update('support_email')}
            placeholder="support@journeo.app"
          />
          <Field
            label="Basın & Medya E-postası"
            value={form.press_email}
            onChange={update('press_email')}
            placeholder="press@journeo.app"
          />
          <Field
            label="Telefon"
            value={form.phone}
            onChange={update('phone')}
            placeholder="+90 ..."
            icon={<Phone className="h-3.5 w-3.5 text-slate-400" />}
          />
          <Field
            label="Adres"
            value={form.address}
            onChange={update('address')}
            placeholder="Istanbul, Turkey"
            icon={<MapPin className="h-3.5 w-3.5 text-slate-400" />}
          />
        </CardContent>
      </Card>

      {/* Social */}
      <Card className="border border-slate-200/80 bg-white shadow-2xs rounded-2xl">
        <CardHeader className="pb-3 border-b border-slate-100/80">
          <CardTitle className="flex items-center gap-3 text-base font-bold text-slate-900">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-pink-600 border border-pink-100">
              <Share2 className="h-4.5 w-4.5" />
            </div>
            Sosyal Medya Hesapları
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5 grid gap-5 sm:grid-cols-3">
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

      {/* Action Save Bar */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-md rounded-xl px-6 py-2.5 text-sm transition-all"
        >
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {saving ? 'Kaydediliyor…' : 'Ayarları Kaydet'}
        </Button>
      </div>
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
    <div className="space-y-1.5">
      <Label className="text-xs font-bold text-slate-700">{label}</Label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
        )}
        <Input
          value={value}
          onChange={onChange}
          className={`border-slate-200/80 bg-white text-slate-900 rounded-xl placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 text-xs ${icon ? 'pl-9' : ''}`}
          placeholder={placeholder ?? `${label} giriniz`}
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
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-bold text-slate-700">
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </Label>
        {value && isValidUrl && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-bold"
          >
            Önizle <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
      <Input
        value={value}
        onChange={onChange}
        className="border-slate-200/80 bg-white text-slate-900 rounded-xl placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 text-xs"
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
  rows = 12,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-bold text-slate-700">{label}</Label>
        {value ? (
          <span className="text-[11px] text-slate-400 font-medium">
            {value.length.toLocaleString('tr-TR')} karakter
          </span>
        ) : null}
      </div>
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full rounded-xl border border-slate-200/80 bg-white p-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none leading-relaxed font-mono"
        placeholder={placeholder}
      />
    </div>
  );
}