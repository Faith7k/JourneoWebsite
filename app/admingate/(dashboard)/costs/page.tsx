import { requireAdmin } from '@/lib/supabase/admin';
import { getCostSummary, getRecentCostEvents } from '@/lib/supabase/costs';
import { formatUsd, parseRange, resolveRange } from '@/lib/costs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminStatCard } from '@/components/admin/stat-card';
import { AdminCostTrendChart } from '@/components/admin/cost-trend-chart';
import { AdminCostBreakdownCard } from '@/components/admin/cost-breakdown-card';
import { AdminCostRangeFilter } from '@/components/admin/cost-range-filter';
import { AlertTriangle, DollarSign, PiggyBank, Route, Wallet } from 'lucide-react';

export const dynamic = 'force-dynamic';

const PROVIDER_STYLES: Record<string, string> = {
  gemini: 'border-purple-200 bg-purple-50 text-purple-700 font-semibold',
  google_places: 'border-amber-200 bg-amber-50 text-amber-700 font-semibold',
  mapbox: 'border-blue-200 bg-blue-50 text-blue-700 font-semibold',
  fal_ai: 'border-pink-200 bg-pink-50 text-pink-700 font-semibold',
};

export default async function AdminCostsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const user = await requireAdmin();
  if (!user) return null;

  const range = parseRange((await searchParams).range);
  const { interval } = resolveRange(range);
  const [summary, recent] = await Promise.all([
    getCostSummary(range),
    getRecentCostEvents(50),
  ]);

  if (!summary) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Maliyetler & Harcama Takibi</h2>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-5 text-sm text-red-700">
            Maliyet özeti yüklenemedi. Ortamda `cost_summary` fonksiyonu henüz dağıtılmamış olabilir.
          </CardContent>
        </Card>
      </div>
    );
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todaysCost = summary.breakdown
    .filter((b) => new Date(b.bucket) >= todayStart)
    .reduce((sum, b) => sum + b.cost_usd, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Maliyetler & Harcama Takibi</h2>
          <p className="text-sm text-slate-500 mt-1">
            Gemini, Google Places, Mapbox ve diğer servislerin birim fiyat defterine göre hesaplanmış gerçek harcamaları.
          </p>
        </div>
        <AdminCostRangeFilter active={range} />
      </div>

      {summary.unpriced_events > 0 && (
        <Card className="border-amber-200 bg-amber-50/80">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-xs text-amber-800">
              <span className="font-semibold">
                {summary.unpriced_events.toLocaleString('tr-TR')} olay fiyatlandırılamadı
              </span>{' '}
              — SKU <code>cost_price_book</code> tablosunda henüz kayıtlı değil veya token ölçümünden önceye ait.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Toplam Harcama"
          value={formatUsd(summary.total_cost_usd, 4)}
          subtitle={`${summary.total_requests.toLocaleString('tr-TR')} faturalandırılabilir olay`}
          icon={DollarSign}
          accent="bg-emerald-50 text-emerald-600 border border-emerald-100"
        />
        <AdminStatCard
          title="Bugünkü Harcama"
          value={formatUsd(todaysCost, 4)}
          subtitle="Yerel geceyarısından beri"
          icon={Wallet}
          accent="bg-blue-50 text-blue-600 border border-blue-100"
        />
        <AdminStatCard
          title="AI Gezi Başı Maliyet"
          value={formatUsd(summary.average_cost_per_trip, 4)}
          subtitle={`${summary.ai_trip_count.toLocaleString('tr-TR')} AI rotası üretildi`}
          icon={Route}
          accent="bg-purple-50 text-purple-600 border border-purple-100"
        />
        <AdminStatCard
          title="Önbellek Tasarrufu"
          value={formatUsd(summary.cache_savings_usd, 4)}
          subtitle="Plan cache + paylaşımlı POI"
          icon={PiggyBank}
          accent="bg-amber-50 text-amber-600 border border-amber-100"
        />
      </div>

      <Card className="border-slate-200/80 bg-white shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900">Zaman İçinde Harcama Eğilimi</CardTitle>
          <CardDescription className="text-xs text-slate-500">
            {interval === 'hour' ? 'Saatlik' : 'Günlük'} ücretli servis harcama akışı.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminCostTrendChart data={summary.breakdown} interval={summary.interval} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminCostBreakdownCard
          title="Servis Sağlayıcıya Göre"
          description="Harcama yapılan dış sağlayıcılar."
          data={summary.by_provider}
        />
        <AdminCostBreakdownCard
          title="Ürün Özelliğine Göre"
          description="Harcamayı oluşturan uygulama akışları."
          data={summary.by_feature}
        />
      </div>

      <Card className="border-slate-200/80 bg-white shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-slate-900">Son Faturalandırılabilir Olaylar</CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Gemini, Google Places ve Mapbox üzerinde gerçekleşen son 50 API çağrısı.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="text-slate-500 font-semibold">Tarih / Saat</TableHead>
                  <TableHead className="text-slate-500 font-semibold">Sağlayıcı</TableHead>
                  <TableHead className="text-slate-500 font-semibold">Özellik</TableHead>
                  <TableHead className="text-slate-500 font-semibold">Detay</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.length === 0 && (
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableCell colSpan={4} className="text-center text-xs text-slate-400 py-6 italic">
                      Henüz faturalandırılabilir olay kaydedilmedi.
                    </TableCell>
                  </TableRow>
                )}
                {recent.map((event) => (
                  <TableRow key={event.id} className="border-slate-100 hover:bg-slate-50/70">
                    <TableCell className="whitespace-nowrap text-xs text-slate-600 font-medium">
                      {new Intl.DateTimeFormat('tr-TR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      }).format(new Date(event.occurred_at))}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          PROVIDER_STYLES[event.provider] ??
                          'border-slate-200 bg-slate-50 text-slate-700'
                        }
                      >
                        {event.provider}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs font-semibold text-slate-800">
                      {event.feature}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      {event.detail ?? '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-slate-500">
        R2 ses depolama maliyeti ({formatUsd(summary.storage_snapshot_usd, 4)}/ay) yukarıdaki anlık akış toplamlarına dahil değildir. Şehir kapak fotoğrafları üretilen görsel başına hesaplanır.
      </p>
    </div>
  );
}
