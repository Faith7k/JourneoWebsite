'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, User, Eye, EyeOff, Shield } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (username === 'admin' && password === 'Fy-123456') {
      // Store auth token in localStorage
      localStorage.setItem('admin_auth', 'true');
      localStorage.setItem('admin_token', btoa('admin:' + password));
      router.push('/admin');
    } else {
      setError('Kullanıcı adı veya şifre hatalı!');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      {/* Floating Security Elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-blue-500/10 rounded-full blur-xl animate-float">
        <Shield className="w-8 h-8 text-blue-500/60 m-4" />
      </div>
      <div className="absolute top-40 right-20 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}>
        <Lock className="w-10 h-10 text-purple-500/60 m-5" />
      </div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-cyan-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}>
        <User className="w-6 h-6 text-cyan-500/60 m-3" />
      </div>

      <div className="container relative z-10 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md mx-auto"
        >
          <Card className="bg-gray-800/95 backdrop-blur-sm border-gray-700 shadow-2xl">
            <CardHeader className="text-center pb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 200 }}
                className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6"
              >
                <Shield className="w-10 h-10 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-white">
                🔐 Admin Girişi
              </CardTitle>
              <p className="text-gray-400 mt-2">
                Yönetici paneline erişim için giriş yapın
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white font-medium">
                    👤 Kullanıcı Adı
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Kullanıcı adınızı girin"
                      className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white font-medium">
                    🔑 Şifre
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Şifrenizi girin"
                      className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm"
                  >
                    ❌ {error}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Giriş yapılıyor...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Giriş Yap
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm">
                  🔒 Bu alan sadece yetkili personel içindir
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
