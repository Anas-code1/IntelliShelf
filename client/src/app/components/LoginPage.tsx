import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Mail, Lock } from 'lucide-react';
import { Button } from './Button';

import api from '../../api';

interface LoginPageProps {
  onLogin: (role: 'admin' | 'librarian' | 'member', name: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // You can pass rememberMe to your backend if needed for token expiration
      const { data } = await api.post('/api/auth/login', { 
        email, 
        password,
        rememberMe 
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      onLogin(data.role, data.name);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel: Hero & Marketing */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-blue-600 to-blue-700 p-12 flex-col justify-between relative overflow-hidden">
        
        {/* 1. Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Smart Library</h1>
          </div>
        </motion.div>

        {/* Ambient Background Blur Effects */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        {/* 2. Image / Illustration Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative z-10 flex-1 flex items-center justify-center my-8"
        >
          <motion.img 
            animate={{ y: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            src="https://illustrations.popsy.co/amber/student-going-to-school.svg" /* Placeholder illustration, replace with your own */
            alt="Library Management Illustration" 
            className="w-full max-w-sm drop-shadow-2xl"
          />
        </motion.div>

        {/* 3. Description & Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            AI-Powered Library Management
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Streamline your library operations with intelligent book recommendations and modern management tools.
          </p>
          <div className="space-y-4">
            {[
              'Smart AI Book Recommendations',
              'Real-time Analytics & Reports',
              'Automated Fine Management',
              'Multi-role Access Control'
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-blue-50">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-2xl border border-border shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h2>
              <p className="text-muted-foreground">Sign in to access your library account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block mb-2 text-sm text-foreground font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block mb-2 text-sm text-foreground font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="rememberMe" className="flex items-center gap-2 cursor-pointer">
                  <input 
                    id="rememberMe"
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-input text-primary focus:ring-primary" 
                  />
                  <span className="text-sm text-foreground select-none">Remember me</span>
                </label>
                
                
              </div>

              <Button type="submit" variant="primary" className="w-full h-11 mt-2" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};