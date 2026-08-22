import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Compass, Sparkles, DollarSign, User } from 'lucide-react';
import { TopTripCreator } from '@/lib/supabase/stats';

type TopCreatorsProps = {
  topTripCreators: TopTripCreator[];
};

export function AdminTopCreatorsCard({ topTripCreators }: TopCreatorsProps) {
  const rankIcons = ['🥇', '🥈', '🥉'];

  return (
    <Card className="border-slate-200/80 bg-white shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
            <Trophy className="h-4 w-4 text-amber-500" />
            En Çok Gezi Oluşturan Üyeler (Power Users)
          </CardTitle>
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 font-semibold">
            Top 10 Lider Tablosu
          </Badge>
        </div>
        <CardDescription className="text-xs text-slate-500">
          En çok seyahat rotası oluşturan, en aktif mobil kullanıcılar ve harcadıkları API maliyeti.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100 hover:bg-transparent">
              <TableHead className="w-12 text-slate-500 font-semibold">Sıra</TableHead>
              <TableHead className="text-slate-500 font-semibold">Kullanıcı / Profil</TableHead>
              <TableHead className="text-slate-500 font-semibold text-center">Oluşturulan Gezi</TableHead>
              <TableHead className="text-slate-500 font-semibold text-center">AI Çağrı Sayısı</TableHead>
              <TableHead className="text-slate-500 font-semibold text-center">Üyelik Tipi</TableHead>
              <TableHead className="text-slate-500 font-semibold text-right">Tahmini Tüketim ($)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topTripCreators.length === 0 ? (
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableCell colSpan={6} className="text-center text-xs text-slate-400 py-6 italic">
                  Henüz gezi oluşturan kullanıcı kaydı yok. Mobil uygulamadan gezi oluşturulduğunda burada görünecektir.
                </TableCell>
              </TableRow>
            ) : (
              topTripCreators.map((user, idx) => (
                <TableRow key={user.userId} className="border-slate-100 hover:bg-slate-50/70">
                  <TableCell className="font-mono text-xs font-bold text-slate-700">
                    {idx < 3 ? rankIcons[idx] : `#${idx + 1}`}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700 border border-slate-200">
                        {user.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900">{user.name}</p>
                        <p className="text-[11px] text-slate-500">{user.username}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-bold text-emerald-600 tabular-nums">
                    <span className="inline-flex items-center gap-1">
                      <Compass className="h-3.5 w-3.5" />
                      {user.tripCount}
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-mono text-xs text-purple-700 font-semibold tabular-nums">
                    <span className="inline-flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      {user.aiGenerationsCount}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {user.subscription === 'premium' ? (
                      <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-semibold">
                        Premium
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-600 text-[10px]">
                        Free
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs font-semibold text-rose-600 tabular-nums">
                    ${user.estimatedCost}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
