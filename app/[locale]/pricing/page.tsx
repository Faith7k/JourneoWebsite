'use client';

import { notFound } from 'next/navigation';
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
  notFound();
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
          scale: 0.3 + Math.random() * 0.4, // 0.3-0.7 arası boyut
          duration: 15 + Math.random() * 20, // 15-35 saniye
          delay: Math.random() * 5,
          image: dollarImages[Math.floor(Math.random() * dollarImages.length)],
        });
      }
      setDollars(newDollars);
    };

    generateDollars();
  }, []);
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Modern Background Effects */}
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-float" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-cyan-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }} />
      
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
            opacity: [0.4, 0.8, 0.4],
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
            className="opacity-60"
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
          <h1 className="heading-modern text-gradient">Pricing</h1>
          <p className="text-modern text-white/90 max-w-3xl mx-auto leading-relaxed">
            Choose the most suitable plan for your travels
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
          <h2 className="heading-modern text-gradient text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="cancel">
              <AccordionTrigger className="text-left text-white hover:text-primary">
                How can I cancel my subscription?
              </AccordionTrigger>
              <AccordionContent className="text-white/80">
                You can cancel your subscription at any time. You can easily perform the cancellation process from Settings &gt; Subscription &gt; Cancel section.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="refund">
              <AccordionTrigger className="text-left text-white hover:text-primary">
                Can I get a refund?
              </AccordionTrigger>
              <AccordionContent className="text-white/80">
                You can request a refund within the first 7 days. For later periods, the cancellation takes effect in the next billing period.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="change">
              <AccordionTrigger className="text-left text-white hover:text-primary">
                Can I change my plan?
              </AccordionTrigger>
              <AccordionContent className="text-white/80">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect in the next billing period.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
}