'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Mail, HelpCircle, Trash2, MapPin, Compass, Plane, Globe } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function SupportPage() {
  const t = useTranslations('support');

  const faqs = [
    {
      question: t('faqs.password.question'),
      answer: t('faqs.password.answer'),
    },
    {
      question: t('faqs.dataDeletion.question'),
      answer: t('faqs.dataDeletion.answer'),
    },
    {
      question: t('faqs.offline.question'),
      answer: t('faqs.offline.answer'),
    },
    {
      question: t('faqs.subscription.question'),
      answer: t('faqs.subscription.answer'),
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAF7F2]">
      {/* Travel-themed Background */}
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
      <svg className="absolute inset-0 w-full h-full text-amber-800/[0.06] pointer-events-none" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5,5">
        <path d="M 12% 35% Q 30% 18% 55% 32% T 88% 68%" />
      </svg>
      
      {/* Floating Travel Elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-amber-500/10 rounded-full blur-xl animate-float">
        <Plane className="w-8 h-8 text-amber-800/40 m-4" />
      </div>
      <div className="absolute top-40 right-20 w-20 h-20 bg-orange-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}>
        <Globe className="w-10 h-10 text-orange-800/40 m-5" />
      </div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-amber-600/10 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}>
        <Compass className="w-6 h-6 text-amber-900/40 m-3" />
      </div>

      <div className="container relative z-10 py-24">
        {/* Hero Section with Question Image */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 space-y-6"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 200 }}
            className="mx-auto w-28 h-28 relative"
          >
            <Image
              src="/images/question.png"
              alt="Question Mark"
              width={112}
              height={112}
              className="w-full h-full object-contain drop-shadow-xl"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="heading-modern text-gradient">
              {t('title')}
            </h1>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed font-medium">
              {t('subtitle')}
            </p>
          </motion.div>
        </motion.div>

        {/* Travel-themed Support Options */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {/* FAQ Card */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="bg-white/85 backdrop-blur-sm border border-amber-900/10 hover:border-amber-900/25 transition-all duration-300 shadow-md hover:shadow-xl h-full">
              <CardHeader className="text-center">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-md shadow-amber-600/20"
                >
                  <MessageCircle className="h-8 w-8 text-white" />
                </motion.div>
                <CardTitle className="text-xl font-bold text-stone-900">{t('cards.faq.title')}</CardTitle>
                <CardDescription className="text-stone-600">
                  {t('cards.faq.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300" asChild>
                  <a href="#faq">{t('cards.faq.button')}</a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Card */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="bg-white/85 backdrop-blur-sm border border-amber-900/10 hover:border-amber-900/25 transition-all duration-300 shadow-md hover:shadow-xl h-full">
              <CardHeader className="text-center">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-700 rounded-2xl flex items-center justify-center mb-4 shadow-md shadow-orange-600/20"
                >
                  <Mail className="h-8 w-8 text-white" />
                </motion.div>
                <CardTitle className="text-xl font-bold text-stone-900">{t('cards.contact.title')}</CardTitle>
                <CardDescription className="text-stone-600">
                  {t('cards.contact.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300" asChild>
                  <Link href="/contact">{t('cards.contact.button')}</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Deletion Card */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="bg-white/85 backdrop-blur-sm border border-amber-900/10 hover:border-amber-900/25 transition-all duration-300 shadow-md hover:shadow-xl h-full">
              <CardHeader className="text-center">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-rose-500 to-amber-700 rounded-2xl flex items-center justify-center mb-4 shadow-md shadow-rose-600/20"
                >
                  <Trash2 className="h-8 w-8 text-white" />
                </motion.div>
                <CardTitle className="text-xl font-bold text-stone-900">{t('cards.dataDeletion.title')}</CardTitle>
                <CardDescription className="text-stone-600">
                  {t('cards.dataDeletion.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-rose-600 to-amber-700 hover:from-rose-700 hover:to-amber-800 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300" asChild>
                  <Link href="/support/data-deletion">{t('cards.dataDeletion.button')}</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Documentation Card */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="bg-white/85 backdrop-blur-sm border border-amber-900/10 hover:border-amber-900/25 transition-all duration-300 shadow-md hover:shadow-xl h-full">
              <CardHeader className="text-center">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-600 to-stone-700 rounded-2xl flex items-center justify-center mb-4 shadow-md shadow-stone-600/20"
                >
                  <HelpCircle className="h-8 w-8 text-white" />
                </motion.div>
                <CardTitle className="text-xl font-bold text-stone-900">{t('cards.docs.title')}</CardTitle>
                <CardDescription className="text-stone-600">
                  {t('cards.docs.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-amber-700 to-stone-800 hover:from-amber-800 hover:to-stone-900 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300" asChild>
                  <Link href="/features">{t('cards.docs.button')}</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Travel-themed FAQ Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          id="faq" 
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-stone-900 mb-3">
              {t('faq')}
            </h2>
            <p className="text-lg text-stone-600 font-medium">
              {t('faqSubtitle')}
            </p>
          </motion.div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.01 }}
                className="bg-white/85 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-amber-900/10"
              >
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={`item-${index}`} className="border-none">
                    <AccordionTrigger className="text-left px-6 py-4 hover:bg-amber-500/5 rounded-2xl transition-colors duration-300">
                      <span className="text-lg font-semibold text-stone-800 flex items-center gap-3">
                        <span className="text-xl">🗺️</span>
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-stone-600 leading-relaxed">
                      <div className="flex items-start gap-3">
                        <span className="text-xl mt-0.5">💡</span>
                        <span>{faq.answer}</span>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Travel-themed Contact CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-20 text-center"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white/85 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-amber-900/10 max-w-2xl mx-auto"
          >
            <div className="space-y-6">
              <div className="text-5xl">🧭</div>
              <h3 className="text-2xl font-bold text-stone-900">
                {t('cta.title')}
              </h3>
              <p className="text-stone-600 text-lg">
                {t('cta.description')}
              </p>
              <Link href="/contact">
                <Button 
                  size="lg" 
                  className="btn-modern text-lg px-8 py-4"
                >
                  {t('cta.button')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
