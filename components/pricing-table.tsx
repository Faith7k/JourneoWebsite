'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

export function PricingTable() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'ay',
      features: [
        'Sene de 1 tane gezi kartı ekleme',
        'Temel rota planlama',
        'Sınırlı AI önerileri',
        'Temel harita görünümü',
        'Topluluk desteği',
      ],
      cta: 'Ücretsiz Başla',
      popular: false,
    },
    {
      name: 'Premium Aylık',
      price: '$13',
      period: 'ay',
      features: [
        'Aylık 5 tane gezi kartı ekleme',
        'Standart TTS modeli',
        'Valiz Özelliği',
        'Gelişmiş rota optimizasyonu',
        'Offline haritalar',
        'Öncelikli destek',
      ],
      cta: 'Aylık Planı Seç',
      popular: true,
    },
    {
      name: 'Premium Yıllık',
      price: '$59',
      period: 'yıl',
      save: 'En iyi değer',
      features: [
        'Ayda 20 tane gezi kartı ekleme',
        'Elevenlabs kaliteli sesli rehber',
        'Valiz Özelliği',
        'Gider takibi',
        'Restoran kartı AI özeti',
        'Kendi rotanızı ekleme',
        '7/24 öncelikli destek',
      ],
      cta: 'Yıllık Planı Seç',
      popular: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {plans.map((plan, index) => (
        <motion.div
          key={plan.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <Card className={`relative h-full ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <Badge className="px-4 py-1">Most Popular</Badge>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/{plan.period}</span>
              </div>
              {'save' in plan && plan.save && (
                <Badge variant="secondary" className="mt-2">
                  {plan.save}
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.popular ? 'default' : 'outline'}
                size="lg"
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

