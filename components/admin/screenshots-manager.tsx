'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Loader2, Plus, Pencil, Trash2, Upload, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import type { Screenshots } from '@/lib/supabase/types';

type Props = { initialScreenshots: Screenshots[] };

const ICON_OPTIONS = ['compass', 'map', 'mic', 'plane', 'mountain', 'globe'];
const COLOR_OPTIONS = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-red-500',
  'from-indigo-500 to-blue-500',
  'from-fuchsia-500 to-purple-500',
  'from-lime-500 to-green-500',
];

export function ScreenshotsManager({ initialScreenshots }: Props) {
  const supabase = createClient();
  const [items, setItems] = useState<Screenshots[]>(initialScreenshots);
  const [editing, setEditing] = useState<Screenshots | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [altText, setAltText] = useState('');
  const [icon, setIcon] = useState(ICON_OPTIONS[0]);
  const [colorTheme, setColorTheme] = useState(COLOR_OPTIONS[0]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [storagePath, setStoragePath] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(true);

  const openCreate = () => {
    setEditing(null);
    setTitle('');
    setDescription('');
    setAltText('');
    setIcon(ICON_OPTIONS[0]);
    setColorTheme(COLOR_OPTIONS[0]);
    setImageFile(null);
    setImageUrl('');
    setStoragePath(null);
    setSortOrder(items.length);
    setIsPublished(true);
    setError(null);
    setDialogOpen(true);
  };

  const openEdit = (s: Screenshots) => {
    setEditing(s);
    setTitle(s.title);
    setDescription(s.description ?? '');
    setAltText(s.alt_text ?? '');
    setIcon(s.icon ?? ICON_OPTIONS[0]);
    setColorTheme(s.color_theme ?? COLOR_OPTIONS[0]);
    setImageFile(null);
    setImageUrl(s.image_url);
    setStoragePath(s.storage_path);
    setSortOrder(s.sort_order);
    setIsPublished(s.is_published);
    setError(null);
    setDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError('Image must be under 4MB.');
      return;
    }
    setImageFile(file);
    setError(null);
  };

  const uploadFile = async (): Promise<{ url: string; path: string } | null> => {
    if (!imageFile) return null;
    setUploading(true);
    try {
      const ext = imageFile.name.split('.').pop() ?? 'png';
      const path = `screenshots/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('screenshots')
        .upload(path, imageFile, { cacheControl: '3600', upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from('screenshots').getPublicUrl(path);
      return { url: data.publicUrl, path };
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setError(null);
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    let finalUrl = imageUrl;
    let finalPath = storagePath;

    if (imageFile) {
      const uploaded = await uploadFile();
      if (!uploaded) return;
      finalUrl = uploaded.url;
      finalPath = uploaded.path;
    }

    if (!finalUrl) {
      setError('An image is required.');
      return;
    }

    const payload = {
      title,
      description: description || null,
      alt_text: altText || null,
      image_url: finalUrl,
      storage_path: finalPath,
      icon,
      color_theme: colorTheme,
      sort_order: sortOrder,
      is_published: isPublished,
    };

    if (editing) {
      try {
        const res = await fetch('/api/screenshots', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editing.id, ...payload }),
        });
        const json = await res.json();
        if (!res.ok || json.error) {
          setError(json.error || 'Failed to update screenshot');
          return;
        }
        setItems((prev) => prev.map((s) => (s.id === editing.id ? json.screenshot : s)));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Update failed');
        return;
      }
    } else {
      try {
        const res = await fetch('/api/screenshots', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok || json.error) {
          setError(json.error || 'Failed to create screenshot');
          return;
        }
        setItems((prev) => [...prev, json.screenshot]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Creation failed');
        return;
      }
    }

    setDialogOpen(false);
  };

  const handleDelete = async (s: Screenshots) => {
    if (!confirm(`Delete "${s.title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/screenshots?id=${encodeURIComponent(s.id)}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        alert(json.error || 'Failed to delete screenshot');
        return;
      }
      setItems((prev) => prev.filter((x) => x.id !== s.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={openCreate}
          className="bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-xs"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ekran Görüntüsü Ekle
        </Button>
      </div>

      {items.length === 0 ? (
        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-xs text-slate-400 italic">Henüz ekran görüntüsü eklenmedi.</p>
            <Button
              onClick={openCreate}
              variant="outline"
              className="mt-4 border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
            >
              <Plus className="mr-2 h-4 w-4" />
              İlk Ekran Görüntüsünü Yükle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <Card key={s.id} className="overflow-hidden border-slate-200/80 bg-white shadow-xs hover:border-slate-300 transition-all">
              <div className="relative aspect-[9/16] bg-slate-100 border-b border-slate-100">
                <Image
                  src={s.image_url}
                  alt={s.alt_text ?? s.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-sm text-slate-900">{s.title}</p>
                    <p className="truncate text-xs text-slate-500 mt-0.5">
                      {s.description ?? 'Açıklama yok'}
                    </p>
                  </div>
                  {s.is_published ? (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-semibold">Yayında</Badge>
                  ) : (
                    <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-500 text-[10px]">
                      Gizli
                    </Badge>
                  )}
                </div>
                <div className="mt-3 flex gap-2 pt-2 border-t border-slate-100">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(s)}
                    className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Düzenle
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(s)}
                    className="border-rose-200 text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Sil
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-slate-200 bg-white text-slate-900 shadow-xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">{editing ? 'Ekran Görüntüsünü Düzenle' : 'Yeni Ekran Görüntüsü Ekle'}</DialogTitle>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4 py-1">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-700">Görsel Dosyası {editing && '(değiştirmemek için boş bırakın)'}</Label>
              <div className="flex items-center gap-3">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                  <Upload className="h-4 w-4 text-slate-500" />
                  Dosya Seç
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {imageFile && (
                  <span className="flex items-center gap-2 text-xs text-slate-700 font-mono">
                    {imageFile.name}
                    <button
                      onClick={() => setImageFile(null)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
              {imageUrl && !imageFile && (
                <p className="text-xs text-slate-400">Mevcut görsel korunacaktır.</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs font-semibold text-slate-700">Başlık</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-slate-200 bg-white text-slate-900"
                placeholder="Örn: AI Rota Oluşturucu"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="desc" className="text-xs font-semibold text-slate-700">Açıklama</Label>
              <Textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-slate-200 bg-white text-slate-900"
                placeholder="Ekran görüntüsünün altında yer alacak kısa açıklama"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="alt" className="text-xs font-semibold text-slate-700">Alt Metin (Erişilebilirlik)</Label>
              <Input
                id="alt"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="border-slate-200 bg-white text-slate-900"
                placeholder="AI rota planlama ekranı görüntüsü"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">İkon</Label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900"
                >
                  {ICON_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Renk Teması</Label>
                <select
                  value={colorTheme}
                  onChange={(e) => setColorTheme(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900"
                >
                  {COLOR_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="sort" className="text-xs font-semibold text-slate-700">Sıralama</Label>
                <Input
                  id="sort"
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="border-slate-200 bg-white text-slate-900"
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Web Sitesinde Yayında
                </label>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Vazgeç
            </Button>
            <Button
              onClick={handleSave}
              disabled={uploading}
              className="bg-blue-600 text-white hover:bg-blue-700 font-semibold"
            >
              {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {uploading ? 'Yükleniyor…' : editing ? 'Değişiklikleri Kaydet' : 'Oluştur'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}