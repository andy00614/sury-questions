"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/lib/language-context";
import LanguageSwitcher from "@/components/language-switcher";
import Link from "next/link";

interface Question {
  id: number;
  section: string;
  section_en?: string;
  question: string;
  question_en?: string;
  type: string;
  options?: Array<{
    value: string;
    label: string;
    label_en?: string;
  }>;
}

interface DetailedResponse {
  id: number;
  created_at: string;
  answers: any;
  raw_data: string;
  [key: string]: any;
}

export default function ResponsesPage() {
  const { t, language } = useLanguage();
  const [responses, setResponses] = useState<DetailedResponse[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState<DetailedResponse | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [responsesRes, questionsRes] = await Promise.all([
        fetch('/api/survey/stats'),
        fetch('/api/survey/questions')
      ]);
      
      const responsesData = await responsesRes.json();
      const questionsData = await questionsRes.json();
      
      if (responsesData.success) {
        setResponses(responsesData.responses);
      }
      if (questionsData.success) {
        setQuestions(questionsData.questions);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseRawData = (rawData: string) => {
    try {
      return JSON.parse(rawData);
    } catch {
      return null;
    }
  };

  const getAnswerDisplay = (question: Question, answer: any) => {
    if (!answer) return '-';
    
    if (question.type === 'text') {
      return answer;
    }
    
    if (question.type === 'multiple' && Array.isArray(answer)) {
      return answer.map(value => {
        const option = question.options?.find(opt => opt.value === value);
        return language === 'zh' ? (option?.label || value) : (option?.label_en || option?.label || value);
      }).join(', ');
    }
    
    if (question.type === 'single') {
      const option = question.options?.find(opt => opt.value === answer);
      return language === 'zh' ? (option?.label || answer) : (option?.label_en || option?.label || answer);
    }
    
    return String(answer);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <LanguageSwitcher variant="floating" />
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">{t('common.loading')}</h1>
        </div>
      </div>
    );
  }

  if (selectedResponse) {
    // Use answers directly from database or parse from raw_data as fallback
    const answers = selectedResponse.answers || parseRawData(selectedResponse.raw_data)?.answers || {};

    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <LanguageSwitcher variant="floating" />
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedResponse(null)}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'zh' ? '返回列表' : 'Back to List'}
            </Button>
            <h1 className="text-2xl font-bold">
              {language === 'zh' ? '问卷详情' : 'Survey Details'} #{selectedResponse.id}
            </h1>
          </div>

          <div className="mb-4 text-sm text-gray-600">
            {language === 'zh' ? '提交时间' : 'Submitted'}: {format(new Date(selectedResponse.created_at), 'yyyy-MM-dd HH:mm:ss')}
          </div>

          <div className="space-y-6">
            {questions.map((question) => (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    <span className="text-blue-600 text-sm font-normal">
                      {language === 'zh' ? question.section : (question.section_en || question.section)}
                    </span>
                    <div className="mt-1">
                      Q{question.id}: {language === 'zh' ? question.question : (question.question_en || question.question)}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-3 rounded">
                    {getAnswerDisplay(question, answers[question.id.toString()])}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <LanguageSwitcher variant="floating" />
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            {language === 'zh' ? '问卷回答详情' : 'Survey Responses Details'}
          </h1>
          <Link href="/admin">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'zh' ? '返回仪表板' : 'Back to Dashboard'}
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'zh' ? '所有问卷回答' : 'All Survey Responses'} ({responses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">ID</th>
                    <th className="text-left p-3">{language === 'zh' ? '提交时间' : 'Submitted'}</th>
                    <th className="text-left p-3">{language === 'zh' ? '设备类型' : 'Device'}</th>
                    <th className="text-left p-3">{language === 'zh' ? '年龄' : 'Age'}</th>
                    <th className="text-left p-3">{language === 'zh' ? '操作' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((response) => {
                    const answers = response.answers || parseRawData(response.raw_data)?.answers || {};
                    
                    return (
                      <tr key={response.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{response.id}</td>
                        <td className="p-3">{format(new Date(response.created_at), 'yyyy-MM-dd HH:mm')}</td>
                        <td className="p-3">
                          {getAnswerDisplay(
                            questions.find(q => q.id === 4) || { id: 4, section: '', question: '', type: 'single', options: [] },
                            answers['4']
                          )}
                        </td>
                        <td className="p-3">
                          {getAnswerDisplay(
                            questions.find(q => q.id === 12) || { id: 12, section: '', question: '', type: 'single', options: [] },
                            answers['12']
                          )}
                        </td>
                        <td className="p-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedResponse(response)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            {language === 'zh' ? '查看' : 'View'}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}