'use client';

import { useTranslations } from 'next-intl';
import { PricingTable } from '@/components/pricing-table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface FloatingDollar {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  duration: number;
  delay: number;
  image: string;
}

export default function PricingPage() {
  const t = useTranslations('pricing');
  const [dollars, setDollars] = useState<FloatingDollar[]>([]);

  useEffect(() => {
    // Generate random dollar bills
    const generateDollars = () => {
      const newDollars: FloatingDollar[] = [];
      const dollarImages = ['/images/dollar.png', '/images/Dolar.png'];
      
      for (let i = 0; i < 12; i++) {
        newDollars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          rotation: Math.random() * 360,
          scale: 0.3 + Math.random() * 0.4,
          duration: 15 + Math.random() * 20,
          delay: Math.random() * 5,
          image: dollarImages[Math.floor(Math.random() * dollarImages.length)],
        });
      }
      setDollars(newDollars);
    };

    generateDollars();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAF7F2]">
      {/* Modern Background Effects */}
      <div className="absolute inset-0 bg-[#FAF7F2]" />
      <div className="absolute inset-0 bg-map-grid opacity-100" />
      
      {/* Topographic Contours SVGs */}
      <svg className="absolute -left-10 top-10 w-[500px] h-[500px] text-amber-900/[0.035] pointer-events-none" viewBox="0 0 100 100" fill="none">
        <path className="map-contour" d="M-20,10 C15,-5 25,25 35,50 C45,75 75,85 120,90" />
        <path className="map-contour" d="M-20,25 C20,10 30,40 40,65 C50,90 85,100 130,105" />
      </svg>
      <svg className="absolute -right-20 bottom-10 w-[500px] h-[500px] text-amber-900/[0.035] pointer-events-none" viewBox="0 0 100 100" fill="none">
        <path className="map-contour" d="M30,120 C40,90 70,80 85,55 C100,30 80,10 120,-20" />
        <path className="map-contour" d="M15,120 C25,80 60,70 75,45 C90,20 70,0 110,-30" />
      </svg>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-amber-500/10 rounded-full blur-xl animate-float" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-amber-600/10 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }} />
      
      {/* Floating Dollar Bills */}
      {dollars.map((dollar) => (
        <motion.div
          key={dollar.id}
          className="absolute pointer-events-none select-none"
          style={{
            left: `${dollar.x}%`,
            top: `${dollar.y}%`,
            transform: `scale(${dollar.scale})`,
          }}
          animate={{
            x: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
            y: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
            rotate: [0, 360, 720],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: dollar.duration,
            delay: dollar.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Image
            src={dollar.image}
            alt="Dollar bill"
            width={80}
            height={40}
            className="opacity-40"
          />
        </motion.div>
      ))}

      <div className="container relative z-10 py-24">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 space-y-6"
        >
          <h1 className="heading-modern text-gradient">{t('title')}</h1>
          <p className="text-modern text-stone-600 max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-24"
        >
          <PricingTable />
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="heading-modern text-gradient text-center mb-12">
            {t('faq.title')}
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="cancel" className="bg-white/85 backdrop-blur-sm rounded-2xl shadow-md border border-amber-900/10 px-6">
              <AccordionTrigger className="text-left text-stone-900 hover:text-amber-700">
                {t('faq.cancel.question')}
              </AccordionTrigger>
              <AccordionContent className="text-stone-600">
                {t('faq.cancel.answer')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="refund" className="bg-white/85 backdrop-blur-sm rounded-2xl shadow-md border border-amber-900/10 px-6">
              <AccordionTrigger className="text-left text-stone-900 hover:text-amber-700">
                {t('faq.refund.question')}
              </AccordionTrigger>
              <AccordionContent className="text-stone-600">
                {t('faq.refund.answer')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="change" className="bg-white/85 backdrop-blur-sm rounded-2xl shadow-md border border-amber-900/10 px-6">
              <AccordionTrigger className="text-left text-stone-900 hover:text-amber-700">
                {t('faq.change.question')}
              </AccordionTrigger>
              <AccordionContent className="text-stone-600">
                {t('faq.change.answer')}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
}