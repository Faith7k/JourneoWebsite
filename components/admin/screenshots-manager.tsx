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
      const { data, error: err } = await supabase
        .from('screenshots')
        .update(payload)
        .eq('id', editing.id)
        .select()
        .single();
      if (err) {
        setError(err.message);
        return;
      }
      setItems((prev) => prev.map((s) => (s.id === editing.id ? data : s)));
    } else {
      const { data, error: err } = await supabase
        .from('screenshots')
        .insert(payload)
        .select()
        .single();
      if (err) {
        setError(err.message);
        return;
      }
      setItems((prev) => [...prev, data]);
    }

    setDialogOpen(false);
  };

  const handleDelete = async (s: Screenshots) => {
    if (!confirm(`Delete "${s.title}"? This cannot be undone.`)) return;
    const { error: err } = await supabase.from('screenshots').delete().eq('id', s.id);
    if (err) {
      alert(err.message);
      return;
    }
    if (s.storage_path) {
      await supabase.storage.from('screenshots').remove([s.storage_path]);
    }
    setItems((prev) => prev.filter((x) => x.id !== s.id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={openCreate}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add screenshot
        </Button>
      </div>

      {items.length === 0 ? (
        <Card className="border-slate-800 bg-slate-900/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-slate-400">No screenshots yet.</p>
            <Button
              onClick={openCreate}
              variant="outline"
              className="mt-4 border-slate-700 text-slate-200"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add your first screenshot
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <Card key={s.id} className="overflow-hidden border-slate-800 bg-slate-900/50">
              <div className="relative aspect-[9/16] bg-slate-800">
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
                    <p className="truncate font-medium text-slate-100">{s.title}</p>
                    <p className="truncate text-xs text-slate-400">
                      {s.description ?? 'No description'}
                    </p>
                  </div>
                  {s.is_published ? (
                    <Badge className="bg-emerald-500/20 text-emerald-300">Live</Badge>
                  ) : (
                    <Badge variant="outline" className="border-slate-700 text-slate-400">
                      Hidden
                    </Badge>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(s)}
                    className="border-slate-700 text-slate-200"
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(s)}
                    className="border-red-900/50 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-slate-800 bg-slate-900 text-slate-100">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit screenshot' : 'Add screenshot'}</DialogTitle>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Image {editing && '(leave empty to keep current)'}</Label>
              <div className="flex items-center gap-3">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800">
                  <Upload className="h-4 w-4" />
                  Choose file
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {imageFile && (
                  <span className="flex items-center gap-2 text-sm text-slate-300">
                    {imageFile.name}
                    <button
                      onClick={() => setImageFile(null)}
                      className="text-slate-500 hover:text-slate-300"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
              {imageUrl && !imageFile && (
                <p className="text-xs text-slate-500">Current image will be kept.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-slate-700 bg-slate-800/50 text-slate-100"
                placeholder="AI route planner"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-slate-700 bg-slate-800/50 text-slate-100"
                placeholder="Short caption shown under the screenshot"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alt">Alt text (accessibility)</Label>
              <Input
                id="alt"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="border-slate-700 bg-slate-800/50 text-slate-100"
                placeholder="Screenshot of the AI route planner screen"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Icon</Label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100"
                >
                  {ICON_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Color theme</Label>
                <select
                  value={colorTheme}
                  onChange={(e) => setColorTheme(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100"
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
              <div className="space-y-2">
                <Label htmlFor="sort">Sort order</Label>
                <Input
                  id="sort"
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="border-slate-700 bg-slate-800/50 text-slate-100"
                />
              </div>
              <div className="flex items-end">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-200">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-800"
                  />
                  Published
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-slate-700 text-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={uploading}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500"
            >
              {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {uploading ? 'Uploading…' : editing ? 'Save changes' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}