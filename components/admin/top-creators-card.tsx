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
    <Card className="border-slate-800 bg-slate-900/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Trophy className="h-5 w-5 text-amber-400" />
            En Çok Gezi Oluşturan Üyeler (Power Users)
          </CardTitle>
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
            Top 10 Lider Tablosu
          </Badge>
        </div>
        <CardDescription className="text-slate-400">
          En çok seyahat rotası oluşturan, en aktif mobil kullanıcılar ve harcadıkları API maliyeti.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800">
              <TableHead className="w-12 text-slate-400">Sıra</TableHead>
              <TableHead className="text-slate-400">Kullanıcı / Profil</TableHead>
              <TableHead className="text-slate-400 text-center">Oluşturulan Gezi</TableHead>
              <TableHead className="text-slate-400 text-center">AI Çağrı Sayısı</TableHead>
              <TableHead className="text-slate-400 text-center">Üyelik Tipi</TableHead>
              <TableHead className="text-slate-400 text-right">Tahmini Tüketim ($)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topTripCreators.length === 0 ? (
              <TableRow className="border-slate-800">
                <TableCell colSpan={6} className="text-center text-xs text-slate-500 py-6">
                  Henüz gezi oluşturan kullanıcı kaydı yok. Mobil uygulamadan gezi oluşturulduğunda burada görünecektir.
                </TableCell>
              </TableRow>
            ) : (
              topTripCreators.map((user, idx) => (
                <TableRow key={user.userId} className="border-slate-800">
                  <TableCell className="font-mono text-sm font-bold text-slate-300">
                    {idx < 3 ? rankIcons[idx] : `#${idx + 1}`}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-300">
                        {user.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.username}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-bold text-emerald-400">
                    <span className="inline-flex items-center gap-1">
                      <Compass className="h-3.5 w-3.5" />
                      {user.tripCount}
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-mono text-xs text-purple-300">
                    <span className="inline-flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      {user.aiGenerationsCount}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {user.subscription === 'premium' ? (
                      <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px]">
                        Premium
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-slate-700 text-slate-400 text-[10px]">
                        Free
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-rose-300">
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
