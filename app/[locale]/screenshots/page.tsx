'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, MapPin, Route, Calendar, Wallet, Briefcase, Settings, Plus, Upload, Save, X } from 'lucide-react';

interface Screenshot {
  id: number;
  title: string;
  description: string;
  alt: string;
  src: string;
  icon: string;
  color: string;
}

export default function ScreenshotsPage() {
  const [selectedScreenshot, setSelectedScreenshot] = useState<number | null>(null);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newScreenshot, setNewScreenshot] = useState<Partial<Screenshot>>({});
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Icon mapping
  const iconMap = {
    'Smartphone': Smartphone,
    'MapPin': MapPin,
    'Route': Route,
    'Calendar': Calendar,
    'Wallet': Wallet,
    'Briefcase': Briefcase,
  };

  // Fetch screenshots from API
  useEffect(() => {
    const fetchScreenshots = async () => {
      try {
        const response = await fetch('/api/screenshots');
        const data = await response.json();
        setScreenshots(data);
      } catch (error) {
        console.error('Error fetching screenshots:', error);
        // Fallback to default screenshots
        setScreenshots([
          { 
            id: 1, 
            alt: 'Main Screen', 
            src: '/images/screenshot-1.png',
            title: 'Welcome Dashboard',
            description: 'Your personal travel hub with AI-powered insights',
            icon: 'Smartphone',
            color: 'from-blue-500 to-cyan-500'
          },
          { 
            id: 2, 
            alt: 'Map View', 
            src: '/images/screenshot-2.png',
            title: 'Interactive Map',
            description: 'Real-time navigation with smart route suggestions',
            icon: 'MapPin',
            color: 'from-green-500 to-emerald-500'
          },
          { 
            id: 3, 
            alt: 'Route Planning', 
            src: '/images/screenshot-3.png',
            title: 'AI Route Planning',
            description: 'Intelligent route optimization for your journey',
            icon: 'Route',
            color: 'from-purple-500 to-pink-500'
          },
          { 
            id: 4, 
            alt: 'Travel Details', 
            src: '/images/screenshot-4.png',
            title: 'Trip Management',
            description: 'Organize and track your travel experiences',
            icon: 'Calendar',
            color: 'from-orange-500 to-red-500'
          },
          { 
            id: 5, 
            alt: 'Smart Suitcase', 
            src: '/images/screenshot-5.png',
            title: 'Smart Packing',
            description: 'AI-powered packing suggestions for your trip',
            icon: 'Briefcase',
            color: 'from-indigo-500 to-blue-500'
          },
          { 
            id: 6, 
            alt: 'Expenses', 
            src: '/images/screenshot-6.png',
            title: 'Expense Tracking',
            description: 'Keep track of your travel budget effortlessly',
            icon: 'Wallet',
            color: 'from-teal-500 to-green-500'
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchScreenshots();
  }, []);

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    setUploadStatus('uploading');
    
    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setNewScreenshot(prev => ({ ...prev, src: result }));
        setUploadStatus('success');
        setTimeout(() => setUploadStatus('idle'), 3000);
      };
      
      reader.onerror = () => {
        setUploadStatus('error');
        setTimeout(() => setUploadStatus('idle'), 3000);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setTimeout(() => setUploadStatus('idle'), 3000);
    }
  };

  // Handle adding new screenshot
  const handleAddScreenshot = async () => {
    if (newScreenshot.title && newScreenshot.description && newScreenshot.src) {
      try {
        const response = await fetch('/api/screenshots', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newScreenshot)
        });
        if (response.ok) {
          fetchScreenshots(); // Refresh data
          setNewScreenshot({});
          setShowAddForm(false);
        }
      } catch (error) {
        console.error('Error adding screenshot:', error);
      }
    }
  };

  // Icon options for dropdown
  const iconOptions = [
    { value: 'Smartphone', label: 'Smartphone' },
    { value: 'MapPin', label: 'Map Pin' },
    { value: 'Route', label: 'Route' },
    { value: 'Calendar', label: 'Calendar' },
    { value: 'Wallet', label: 'Wallet' },
    { value: 'Briefcase', label: 'Briefcase' }
  ];

  const colorOptions = [
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-blue-500',
    'from-teal-500 to-green-500',
    'from-pink-500 to-rose-500',
    'from-yellow-500 to-orange-500'
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-blue-500 to-purple-600" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float">
        <Smartphone className="w-10 h-10 text-white/60 m-5" />
      </div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}>
        <MapPin className="w-12 h-12 text-white/60 m-6" />
      </div>
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}>
        <Route className="w-8 h-8 text-white/60 m-4" />
      </div>

      <div className="container relative z-10 py-24">
        {/* Hero Section */}
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
            <div className="w-full h-full bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Smartphone className="w-16 h-16 text-white" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="heading-modern text-white drop-shadow-lg">
              📱 Screenshots 📱
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-medium">
              Explore the Journeo app up close and discover its amazing features! ✨
            </p>
          </motion.div>
        </motion.div>

        {/* Upload Status */}
        {uploadStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className={`p-4 rounded-lg text-center ${
              uploadStatus === 'success' ? 'bg-green-100 text-green-800' :
              uploadStatus === 'error' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {uploadStatus === 'uploading' && '📤 Uploading image...'}
              {uploadStatus === 'success' && '✅ Image uploaded successfully!'}
              {uploadStatus === 'error' && '❌ Upload failed. Please try again.'}
            </div>
          </motion.div>
        )}

        {/* Add New Screenshot Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-12"
        >
          <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Plus className="w-6 h-6 text-blue-600" />
                Add New Screenshot
              </CardTitle>
              <CardDescription>
                Upload and share your app screenshots with the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showAddForm ? (
                <Button 
                  onClick={() => setShowAddForm(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Screenshot
                </Button>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newScreenshot.title || ''}
                        onChange={(e) => setNewScreenshot(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Welcome Dashboard"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="alt">Alt Text</Label>
                      <Input
                        id="alt"
                        value={newScreenshot.alt || ''}
                        onChange={(e) => setNewScreenshot(prev => ({ ...prev, alt: e.target.value }))}
                        placeholder="Main Screen"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newScreenshot.description || ''}
                      onChange={(e) => setNewScreenshot(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Your personal travel hub with AI-powered insights"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <select
                        value={newScreenshot.icon || ''}
                        onChange={(e) => setNewScreenshot(prev => ({ ...prev, icon: e.target.value }))}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="">Select Icon</option>
                        {iconOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Color Theme</Label>
                      <select
                        value={newScreenshot.color || ''}
                        onChange={(e) => setNewScreenshot(prev => ({ ...prev, color: e.target.value }))}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="">Select Color</option>
                        {colorOptions.map(color => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Upload Image</Label>
                    <div className="flex items-center gap-4">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                        className="hidden"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="flex-1"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Image
                      </Button>
                      {newScreenshot.src && (
                        <div className="text-sm text-green-600">✅ Image selected</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      onClick={handleAddScreenshot}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Screenshot
                    </Button>
                    <Button 
                      onClick={() => {
                        setShowAddForm(false);
                        setNewScreenshot({});
                      }}
                      variant="outline"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/80">Loading screenshots...</p>
          </div>
        )}

        {/* Interactive Screenshots Grid */}
        {!loading && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          >
            {screenshots.map((screenshot, index) => {
              const IconComponent = iconMap[screenshot.icon as keyof typeof iconMap] || Smartphone;
              return (
              <motion.div
                key={screenshot.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="group cursor-pointer"
                onClick={() => setSelectedScreenshot(selectedScreenshot === screenshot.id ? null : screenshot.id)}
              >
                <div className="relative aspect-[9/19] rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl bg-white/10 backdrop-blur-sm transition-all duration-300 group-hover:border-white/40 group-hover:shadow-3xl">
                  {/* Phone Frame */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl">
                    {/* Status Bar */}
                    <div className="absolute top-0 left-0 right-0 h-8 bg-black/50 flex items-center justify-between px-4 text-white text-xs">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                      </div>
                    </div>
                    
                    {/* App Content */}
                    <div className="absolute inset-0 pt-8 flex flex-col items-center justify-center p-6">
                      {screenshot.src && screenshot.src.startsWith('data:') ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <img 
                            src={screenshot.src} 
                            alt={screenshot.alt}
                            className="w-full h-full object-cover rounded-2xl"
                          />
                        </div>
                      ) : (
                        <>
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                            className={`w-16 h-16 bg-gradient-to-br ${screenshot.color} rounded-full flex items-center justify-center mb-4`}
                          >
                            <IconComponent className="w-8 h-8 text-white" />
                          </motion.div>
                          
                          <h3 className="text-white font-bold text-lg mb-2 text-center">
                            {screenshot.title}
                          </h3>
                          
                          <p className="text-white/80 text-sm text-center leading-relaxed">
                            {screenshot.description}
                          </p>
                        </>
                      )}
                      
                      {/* App-like UI elements */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/20 rounded-2xl p-3 backdrop-blur-sm">
                          <div className="flex items-center justify-between">
                            <div className="w-8 h-8 bg-white/30 rounded-full"></div>
                            <div className="w-8 h-8 bg-white/30 rounded-full"></div>
                            <div className="w-8 h-8 bg-white/30 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <Button 
                      size="sm" 
                      className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
          </motion.div>
        )}


        {/* Bottom Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <p className="text-white/90 text-lg font-medium">
              📱 Screenshots reflect the actual application. Interface may change with updates. 📱
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
