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
      {/* Travel-themed Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-blue-500 to-purple-600" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      {/* Floating Travel Elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-white/10 rounded-full blur-xl animate-float">
        <Plane className="w-8 h-8 text-white/60 m-4" />
      </div>
      <div className="absolute top-40 right-20 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}>
        <Globe className="w-10 h-10 text-white/60 m-5" />
      </div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}>
        <Compass className="w-6 h-6 text-white/60 m-3" />
      </div>

      <div className="container relative z-10 py-24">
        {/* Hero Section with Question Image */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 space-y-8"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 200 }}
            className="mx-auto w-32 h-32 relative"
          >
            <Image
              src="/images/question.png"
              alt="Question Mark"
              width={128}
              height={128}
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="heading-modern text-white drop-shadow-lg">
              🗺️ {t('title')} 🗺️
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-medium">
              {t('subtitle')} Let's navigate through your questions together! 🧭
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
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 shadow-xl hover:shadow-2xl">
              <CardHeader className="text-center">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4"
                >
                  <MessageCircle className="h-8 w-8 text-white" />
                </motion.div>
                <CardTitle className="text-xl font-bold text-gray-800">🗺️ {t('faq')}</CardTitle>
                <CardDescription className="text-gray-600">
                  Find answers to common questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                  <a href="#faq">🔍 Browse FAQ</a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Card */}
          <motion.div
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-green-200 hover:border-green-400 transition-all duration-300 shadow-xl hover:shadow-2xl">
              <CardHeader className="text-center">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mb-4"
                >
                  <Mail className="h-8 w-8 text-white" />
                </motion.div>
                <CardTitle className="text-xl font-bold text-gray-800">✈️ {t('contactUs')}</CardTitle>
                <CardDescription className="text-gray-600">
                  Send us a message
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                  <Link href="/contact">📧 Contact Form</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Deletion Card */}
          <motion.div
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-red-200 hover:border-red-400 transition-all duration-300 shadow-xl hover:shadow-2xl">
              <CardHeader className="text-center">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mb-4"
                >
                  <Trash2 className="h-8 w-8 text-white" />
                </motion.div>
                <CardTitle className="text-xl font-bold text-gray-800">🗑️ {t('dataDeletion.title')}</CardTitle>
                <CardDescription className="text-gray-600">
                  {t('dataDeletion.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                  <Link href="/support/data-deletion">🗂️ Delete Data</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Documentation Card */}
          <motion.div
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 shadow-xl hover:shadow-2xl">
              <CardHeader className="text-center">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-4"
                >
                  <HelpCircle className="h-8 w-8 text-white" />
                </motion.div>
                <CardTitle className="text-xl font-bold text-gray-800">📚 Documentation</CardTitle>
                <CardDescription className="text-gray-600">
                  Read our guides
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                  <Link href="/features">📖 View Features</Link>
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
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white drop-shadow-lg mb-4">
              🧭 {t('faq')} 🧭
            </h2>
            <p className="text-xl text-white/90 font-medium">
              Your travel questions answered! ✈️
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
                whileHover={{ scale: 1.02 }}
                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-white/20"
              >
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={`item-${index}`} className="border-none">
                    <AccordionTrigger className="text-left px-6 py-4 hover:bg-blue-50/50 rounded-2xl transition-colors duration-300">
                      <span className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                        <span className="text-2xl">🗺️</span>
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-gray-700 leading-relaxed">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl mt-1">💡</span>
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
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-white/20 max-w-2xl mx-auto"
          >
            <div className="space-y-6">
              <div className="text-6xl">🚀</div>
              <h3 className="text-2xl font-bold text-gray-800">
                Still need help? Let's explore together! 🧭
              </h3>
              <p className="text-gray-600 text-lg">
                Our support team is ready to guide you on your journey! ✈️
              </p>
              <Link href="/contact">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  🗺️ Contact Support 🗺️
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

