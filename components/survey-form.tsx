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
  const [surveyQuestions, setSurveyQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <p>加载问卷中...</p>
        </CardContent>
      </Card>
    );
  }

  if (surveyQuestions.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <p>暂无问卷题目</p>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = surveyQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / surveyQuestions.length) * 100;

  const handleSingleChoice = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
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
    if (currentQuestionIndex < surveyQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
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
        alert('提交失败，请重试');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('提交失败，请重试');
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2">提交成功！</h2>
            <p className="text-gray-600">感谢您参与我们的市场调查</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              问题 {currentQuestionIndex + 1} / {surveyQuestions.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <div className="text-sm text-blue-600 font-medium mb-2">
              {currentQuestion.section}
            </div>
            <CardTitle className="text-lg leading-relaxed">
              {currentQuestion.question}
            </CardTitle>
            {currentQuestion.required && (
              <span className="text-red-500 text-sm">* 必填</span>
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
                      {option.label}
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
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            {currentQuestion.type === 'text' && (
              <Textarea
                placeholder="请输入您的回答..."
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
            上一题
          </Button>

          {currentQuestionIndex === surveyQuestions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!canGoNext()}
              className="flex items-center gap-2"
            >
              提交问卷
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canGoNext()}
              className="flex items-center gap-2"
            >
              下一题
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}