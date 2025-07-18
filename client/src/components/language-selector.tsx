import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Language, getLanguageName, availableLanguages } from '@/lib/i18n';

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'card' | 'inline';
  showIcon?: boolean;
  onLanguageChange?: (language: Language) => void;
}

export function LanguageSelector({ 
  variant = 'dropdown', 
  showIcon = true,
  onLanguageChange 
}: LanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
  };

  if (variant === 'card') {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          {showIcon && <Globe className="w-5 h-5" />}
          {t.selectLanguage}
        </h3>
        <div className="grid gap-3">
          {availableLanguages.map((lang) => (
            <Card 
              key={lang}
              className={`cursor-pointer transition-all hover:shadow-md ${
                language === lang ? 'ring-2 ring-primary border-primary' : ''
              }`}
              onClick={() => handleLanguageChange(lang)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {lang === 'en' && '🇺🇸'}
                      {lang === 'hi' && '🇮🇳'}
                      {lang === 'pa' && '🇮🇳'}
                    </div>
                    <div>
                      <p className="font-medium">{getLanguageName(lang)}</p>
                      <p className="text-sm text-gray-600">
                        {lang === 'en' && 'English'}
                        {lang === 'hi' && 'हिंदी'}
                        {lang === 'pa' && 'ਪੰਜਾਬੀ'}
                      </p>
                    </div>
                  </div>
                  {language === lang && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center space-x-2">
        {showIcon && <Globe className="w-4 h-4 text-gray-600" />}
        <div className="flex space-x-1">
          {availableLanguages.map((lang) => (
            <Button
              key={lang}
              variant={language === lang ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleLanguageChange(lang)}
              className="h-8 px-2 text-xs"
            >
              {getLanguageName(lang)}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div className="flex items-center space-x-2">
      {showIcon && <Globe className="w-4 h-4 text-gray-600" />}
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {availableLanguages.map((lang) => (
            <SelectItem key={lang} value={lang}>
              <div className="flex items-center space-x-2">
                <span className="text-lg">
                  {lang === 'en' && '🇺🇸'}
                  {lang === 'hi' && '🇮🇳'}
                  {lang === 'pa' && '🇮🇳'}
                </span>
                <span>{getLanguageName(lang)}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}