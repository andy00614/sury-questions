"use client";

import { useLanguage } from '@/lib/language-context';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface LanguageSwitcherProps {
  variant?: 'default' | 'floating';
  className?: string;
}

export default function LanguageSwitcher({ variant = 'default', className = '' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  if (variant === 'floating') {
    return (
      <motion.div
        className={`fixed top-4 right-4 z-50 ${className}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={toggleLanguage}
          variant="outline"
          size="sm"
          className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-lg hover:text-gray-900 transition-all duration-300"
        >
          <Globe className="w-4 h-4 mr-2" />
          {language === 'zh' ? 'EN' : '中文'}
        </Button>
      </motion.div>
    );
  }

  return (
    <Button
      onClick={toggleLanguage}
      variant="ghost"
      size="sm"
      className={`flex items-center space-x-2 ${className}`}
    >
      <Globe className="w-4 h-4" />
      <span>{language === 'zh' ? 'English' : '中文'}</span>
    </Button>
  );
}