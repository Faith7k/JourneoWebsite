'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Brain, MapPin, Volume2, Briefcase, Cloud, Share2, Wallet, Calendar } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  iconName: string;
  delay?: number;
}

const iconMap = {
  Brain,
  MapPin,
  Volume2,
  Briefcase,
  Cloud,
  Share2,
  Wallet,
  Calendar,
};

export function FeatureCard({ title, description, iconName, delay = 0 }: FeatureCardProps) {
  const Icon = iconMap[iconName as keyof typeof iconMap] || Brain;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, type: "spring", bounce: 0.3 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="h-full"
    >
      <Card className="card-modern h-full group relative overflow-hidden">
        <CardHeader className="pb-4 relative z-10">
          <motion.div 
            className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Icon className="h-8 w-8 text-white" />
          </motion.div>
          <CardTitle className="text-xl font-bold text-gradient group-hover:text-white transition-colors duration-300">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <CardDescription className="text-base leading-relaxed text-muted-foreground group-hover:text-white/80 transition-colors duration-300">
            {description}
          </CardDescription>
        </CardContent>
        
        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
      </Card>
    </motion.div>
  );
}

