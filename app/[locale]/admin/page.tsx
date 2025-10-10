'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  Plus,
  Settings,
  Smartphone,
  MapPin,
  Route,
  Calendar,
  Wallet,
  Briefcase
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Screenshot {
  id: number;
  title: string;
  description: string;
  alt: string;
  src: string;
  icon: string;
  color: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([
    {
      id: 1,
      title: 'Welcome Dashboard',
      description: 'Your personal travel hub with AI-powered insights',
      alt: 'Main Screen',
      src: '/images/screenshot-1.png',
      icon: 'Smartphone',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      title: 'Interactive Map',
      description: 'Real-time navigation with smart route suggestions',
      alt: 'Map View',
      src: '/images/screenshot-2.png',
      icon: 'MapPin',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 3,
      title: 'AI Route Planning',
      description: 'Intelligent route optimization for your journey',
      alt: 'Route Planning',
      src: '/images/screenshot-3.png',
      icon: 'Route',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 4,
      title: 'Trip Management',
      description: 'Organize and track your travel experiences',
      alt: 'Travel Details',
      src: '/images/screenshot-4.png',
      icon: 'Calendar',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 5,
      title: 'Smart Packing',
      description: 'AI-powered packing suggestions for your trip',
      alt: 'Smart Suitcase',
      src: '/images/screenshot-5.png',
      icon: 'Briefcase',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      id: 6,
      title: 'Expense Tracking',
      description: 'Keep track of your travel budget effortlessly',
      alt: 'Expenses',
      src: '/images/screenshot-6.png',
      icon: 'Wallet',
      color: 'from-teal-500 to-green-500'
    }
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [newScreenshot, setNewScreenshot] = useState<Partial<Screenshot>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Authentication check
  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('admin_auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      } else {
        router.push('/admin-login');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const iconOptions = [
    { value: 'Smartphone', label: 'Smartphone', icon: Smartphone },
    { value: 'MapPin', label: 'Map Pin', icon: MapPin },
    { value: 'Route', label: 'Route', icon: Route },
    { value: 'Calendar', label: 'Calendar', icon: Calendar },
    { value: 'Wallet', label: 'Wallet', icon: Wallet },
    { value: 'Briefcase', label: 'Briefcase', icon: Briefcase }
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

  const handleImageUpload = async (file: File, screenshotId?: number) => {
    setUploadStatus('uploading');
    
    try {
      // Create a preview URL for the uploaded file
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result as string;
        
        if (screenshotId) {
          setScreenshots(prev => prev.map(s => 
            s.id === screenshotId ? { ...s, src: result } : s
          ));
        } else {
          setNewScreenshot(prev => ({ ...prev, src: result }));
        }
        
        setUploadStatus('success');
        setTimeout(() => setUploadStatus('idle'), 3000);
      };
      
      reader.onerror = () => {
        setUploadStatus('error');
        setTimeout(() => setUploadStatus('idle'), 3000);
      };
      
      // Read the file as data URL for preview
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setTimeout(() => setUploadStatus('idle'), 3000);
    }
  };

  const handleSave = (screenshot: Screenshot) => {
    setScreenshots(prev => prev.map(s => s.id === screenshot.id ? screenshot : s));
    setEditingId(null);
  };

  const handleAdd = () => {
    if (newScreenshot.title && newScreenshot.description && newScreenshot.src) {
      const newId = Math.max(...screenshots.map(s => s.id)) + 1;
      setScreenshots(prev => [...prev, { ...newScreenshot, id: newId } as Screenshot]);
      setNewScreenshot({});
      setShowAddForm(false);
    }
  };

  const handleDelete = (id: number) => {
    setScreenshots(prev => prev.filter(s => s.id !== id));
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Show login redirect if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float">
        <Settings className="w-10 h-10 text-white/60 m-5" />
      </div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}>
        <ImageIcon className="w-12 h-12 text-white/60 m-6" />
      </div>

      <div className="container relative z-10 py-24">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 space-y-6"
        >
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Settings className="w-12 h-12 text-white" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="heading-modern text-white drop-shadow-lg">
                🛠️ Admin Panel 🛠️
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-medium">
                Manage your app screenshots and content
              </p>
            </div>
            <Button
              onClick={() => {
                localStorage.removeItem('admin_auth');
                localStorage.removeItem('admin_token');
                router.push('/admin-login');
              }}
              variant="outline"
              className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50"
            >
              🚪 Çıkış Yap
            </Button>
          </div>
        </motion.div>

        {/* Upload Status */}
        {uploadStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Alert variant={uploadStatus === 'success' ? 'default' : uploadStatus === 'error' ? 'destructive' : 'default'}>
              <AlertDescription>
                {uploadStatus === 'uploading' && '📤 Uploading image...'}
                {uploadStatus === 'success' && '✅ Image uploaded successfully!'}
                {uploadStatus === 'error' && '❌ Upload failed. Please try again.'}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Add New Screenshot */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-12"
        >
          <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Plus className="w-6 h-6 text-blue-600" />
                Add New Screenshot
              </CardTitle>
              <CardDescription>
                Upload and configure a new app screenshot
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
                      onClick={handleAdd}
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

        {/* Screenshots List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            📱 Current Screenshots
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {screenshots.map((screenshot, index) => (
              <motion.div
                key={screenshot.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{screenshot.title}</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(editingId === screenshot.id ? null : screenshot.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(screenshot.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{screenshot.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Preview */}
                    <div className="aspect-[9/19] bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
                      {screenshot.src && screenshot.src.startsWith('data:') ? (
                        <img 
                          src={screenshot.src} 
                          alt={screenshot.alt}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      ) : (
                        <div className="text-center text-white">
                          <div className="text-4xl mb-2">📱</div>
                          <div className="text-sm">{screenshot.alt}</div>
                        </div>
                      )}
                    </div>
                    
                    {/* Edit Form */}
                    {editingId === screenshot.id && (
                      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={screenshot.title}
                            onChange={(e) => setScreenshots(prev => prev.map(s => 
                              s.id === screenshot.id ? { ...s, title: e.target.value } : s
                            ))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={screenshot.description}
                            onChange={(e) => setScreenshots(prev => prev.map(s => 
                              s.id === screenshot.id ? { ...s, description: e.target.value } : s
                            ))}
                            rows={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Upload New Image</Label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, screenshot.id);
                            }}
                            className="w-full p-2 border rounded-lg"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleSave(screenshot)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button 
                            onClick={() => setEditingId(null)}
                            size="sm"
                            variant="outline"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
