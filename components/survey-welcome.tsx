"use client";

import { Button } from "@/components/ui/button";
import { surveyQuestions } from "@/lib/survey-data";

interface SurveyWelcomeProps {
  onStart: () => void;
}

export default function SurveyWelcome({ onStart }: SurveyWelcomeProps) {
  const estimatedTime = Math.ceil(surveyQuestions.length * 0.5);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          市场调查问卷
        </h1>
        
        <p className="text-gray-600 mb-8">
          {surveyQuestions.length} 道题目，约 {estimatedTime} 分钟
        </p>
        
        <Button 
          onClick={onStart} 
          className="w-full py-3 text-lg"
        >
          开始问卷
        </Button>
      </div>
    </div>
  );
}