'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Mail, HelpCircle, Trash2 } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { motion } from 'framer-motion';

export default function SupportPage() {
  const t = useTranslations('support');

  const faqs = [
    {
      question: 'How do I reset my password?',
      answer: 'You can reset your password by clicking "Forgot Password" on the login screen.',
    },
    {
      question: 'How can I delete my account?',
      answer: 'Please visit the Data Deletion page for step-by-step instructions on how to delete your account and all associated data.',
    },
    {
      question: 'Is offline mode available?',
      answer: 'Yes, you can download maps for offline use in the app settings.',
    },
    {
      question: 'How do I cancel my subscription?',
      answer: 'You can cancel your subscription through your App Store or Google Play account settings.',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Modern Background Effects */}
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-float" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-cyan-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }} />

      <div className="container relative z-10 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 space-y-6"
        >
          <h1 className="heading-modern text-gradient">{t('title')}</h1>
          <p className="text-modern text-white/90 max-w-3xl mx-auto leading-relaxed">{t('subtitle')}</p>
        </motion.div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="hover:border-primary transition-all">
            <CardHeader>
              <MessageCircle className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{t('faq')}</CardTitle>
              <CardDescription>
                Find answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <a href="#faq">Browse FAQ</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-primary transition-all">
            <CardHeader>
              <Mail className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{t('contactUs')}</CardTitle>
              <CardDescription>
                Send us a message
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/contact">Contact Form</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-primary transition-all">
            <CardHeader>
              <Trash2 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{t('dataDeletion.title')}</CardTitle>
              <CardDescription>
                {t('dataDeletion.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/support/data-deletion">Delete Data</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-primary transition-all">
            <CardHeader>
              <HelpCircle className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Documentation</CardTitle>
              <CardDescription>
                Read our guides
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/features">View Features</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t('faq')}</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Still need help?
          </p>
          <Link href="/contact">
            <Button size="lg">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

