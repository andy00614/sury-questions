"use client";

import { Button } from "@/components/ui/button";
import { surveyQuestions } from "@/lib/survey-data";
import { useLanguage } from "@/lib/language-context";
import LanguageSwitcher from "./language-switcher";
import { Clock, Target } from "lucide-react";

interface SurveyWelcomeProps {
  onStart: () => void;
}

export default function SurveyWelcome({ onStart }: SurveyWelcomeProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <LanguageSwitcher variant="floating" />
      
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {t('welcome.title')}
          </h1>
          <p className="text-gray-600">
            {t('welcome.subtitle')}
          </p>
        </div>

        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>{surveyQuestions.length} {t('welcome.questions')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{t('welcome.time')}</span>
          </div>
        </div>
        
        <Button 
          onClick={onStart} 
          className="w-full"
        >
          {t('welcome.start')}
        </Button>
      </div>
    </div>
  );
}