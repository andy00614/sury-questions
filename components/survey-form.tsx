"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import LanguageSwitcher from "./language-switcher";

interface Question {
  id: number;
  section: string;
  section_en?: string;
  question: string;
  question_en?: string;
  type: string;
  required?: boolean;
  options?: Array<{
    value: string;
    label: string;
    label_en?: string;
  }>;
}

export default function SurveyForm() {
  const { t, language } = useLanguage();
  const [surveyQuestions, setSurveyQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/survey/questions');
      const data = await response.json();
      if (data.success && data.questions) {
        setSurveyQuestions(data.questions);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter questions based on conditional logic
  const getVisibleQuestions = () => {
    return surveyQuestions.filter(question => {
      // Question 6 (Android price range) should only show if user selected "android" for question 4
      if (question.id === 6) {
        return answers[4] === 'android';
      }
      return true;
    });
  };

  const visibleQuestions = getVisibleQuestions();

  // Adjust current question index if the current question becomes invisible due to conditional logic
  useEffect(() => {
    if (visibleQuestions.length > 0 && currentQuestionIndex >= visibleQuestions.length) {
      setCurrentQuestionIndex(Math.max(0, visibleQuestions.length - 1));
    }
  }, [visibleQuestions.length, currentQuestionIndex]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <LanguageSwitcher variant="floating" />
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <p>{t('survey.loading')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (visibleQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <LanguageSwitcher variant="floating" />
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <p>{t('survey.no_questions')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = visibleQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / visibleQuestions.length) * 100;

  const handleSingleChoice = (questionId: number, value: string) => {
    setAnswers(prev => {
      const newAnswers = { ...prev, [questionId]: value };

      // If user changes device type answer (question 4), clear Android price answer (question 6)
      if (questionId === 4 && value === 'ios') {
        delete newAnswers[6];
      }

      return newAnswers;
    });
  };

  const handleMultipleChoice = (questionId: number, value: string, checked: boolean) => {
    setAnswers(prev => {
      const currentAnswers = (prev[questionId] as string[]) || [];
      if (checked) {
        return { ...prev, [questionId]: [...currentAnswers, value] };
      } else {
        return { ...prev, [questionId]: currentAnswers.filter(answer => answer !== value) };
      }
    });
  };

  const handleTextInput = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const isCurrentQuestionAnswered = () => {
    const answer = answers[currentQuestion.id];
    if (!currentQuestion.required) return true;
    if (currentQuestion.type === 'multiple') {
      return Array.isArray(answer) && answer.length > 0;
    }
    return answer !== undefined && answer !== '';
  };

  const canGoNext = () => {
    return isCurrentQuestionAnswered();
  };

  const handleNext = () => {
    if (currentQuestionIndex < visibleQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert(language === 'zh' ? '提交失败，请重试' : 'Submission failed, please try again');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert(language === 'zh' ? '提交失败，请重试' : 'Submission failed, please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <LanguageSwitcher variant="floating" />
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">{t('survey.success.title')}</h2>
          <p className="text-gray-500 leading-relaxed">
            {t('survey.success.message')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <LanguageSwitcher variant="floating" />
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-slate-800">
                {t('survey.question')} {currentQuestionIndex + 1}
              </span>
              <span className="text-sm text-slate-500 font-medium">
                / {visibleQuestions.length}
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-3 bg-slate-100" />
        </div>

        <Card>
          <CardHeader>
            <div className="text-sm text-blue-600 font-medium mb-2">
              {language === 'zh' ? currentQuestion.section : (currentQuestion.section_en || currentQuestion.section)}
            </div>
            <CardTitle className="text-lg leading-relaxed">
              {language === 'zh' ? currentQuestion.question : (currentQuestion.question_en || currentQuestion.question)}
            </CardTitle>
            {currentQuestion.required && (
              <span className="text-red-500 text-sm">* {t('survey.required')}</span>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestion.type === 'single' && currentQuestion.options && (
              <RadioGroup
                value={answers[currentQuestion.id] as string || ''}
                onValueChange={(value) => handleSingleChoice(currentQuestion.id, value)}
              >
                {currentQuestion.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="text-sm leading-relaxed cursor-pointer">
                      {language === 'zh' ? option.label : (option.label_en || option.label)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQuestion.type === 'multiple' && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.value}
                      checked={((answers[currentQuestion.id] as string[]) || []).includes(option.value)}
                      onCheckedChange={(checked) => 
                        handleMultipleChoice(currentQuestion.id, option.value, checked as boolean)
                      }
                    />
                    <Label htmlFor={option.value} className="text-sm leading-relaxed cursor-pointer">
                      {language === 'zh' ? option.label : (option.label_en || option.label)}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            {currentQuestion.type === 'text' && (
              <Textarea
                placeholder={t('survey.placeholder.text')}
                value={answers[currentQuestion.id] as string || ''}
                onChange={(e) => handleTextInput(currentQuestion.id, e.target.value)}
                className="min-h-[100px]"
              />
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('survey.previous')}
          </Button>

          {currentQuestionIndex === visibleQuestions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!canGoNext() || isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {language === 'zh' ? '提交中...' : 'Submitting...'}
                </>
              ) : (
                t('survey.submit')
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canGoNext()}
              className="flex items-center gap-2"
            >
              {t('survey.next')}
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}