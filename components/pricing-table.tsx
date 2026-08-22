'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function PricingTable() {
  const t = useTranslations('pricing');

  const plans = [
    {
      name: t('free.title'),
      price: t('free.price'),
      period: t('free.period'),
      features: t.raw('free.features') as string[],
      cta: t('free.cta'),
      popular: false,
    },
    {
      name: t('monthly.title'),
      price: t('monthly.price'),
      period: t('monthly.period'),
      features: t.raw('monthly.features') as string[],
      cta: t('monthly.cta'),
      popular: true,
    },
    {
      name: t('yearly.title'),
      price: t('yearly.price'),
      period: t('yearly.period'),
      save: t('yearly.save'),
      features: t.raw('yearly.features') as string[],
      cta: t('yearly.cta'),
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
          <Card className={`relative h-full bg-white/85 backdrop-blur-sm border ${plan.popular ? 'border-amber-600 shadow-xl scale-105 ring-2 ring-amber-500/20' : 'border-amber-900/10 shadow-md'}`}>
            {plan.popular && (
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <Badge className="px-4 py-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold shadow-md">
                  {t('popularBadge')}
                </Badge>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-stone-900">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-stone-900">{plan.price}</span>
                <span className="text-stone-500">/{plan.period}</span>
              </div>
              {'save' in plan && plan.save && (
                <Badge variant="secondary" className="mt-2 bg-amber-500/10 text-amber-800 border-amber-900/10">
                  {plan.save}
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-stone-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className={`w-full ${plan.popular ? 'btn-modern' : 'bg-white border border-amber-900/15 text-stone-800 hover:bg-amber-500/10 shadow-sm'}`}
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
