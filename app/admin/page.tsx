"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  answers: Record<string, unknown> | null;
  raw_data: string;
  [key: string]: unknown;
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

  const getAnswerDisplay = (question: Question, answer: unknown): string => {
    if (!answer) return '-';
    
    if (question.type === 'text') {
      return String(answer);
    }
    
    if (question.type === 'multiple' && Array.isArray(answer)) {
      return answer.map(value => {
        const option = question.options?.find(opt => opt.value === value);
        return language === 'zh' ? (option?.label || value) : (option?.label_en || option?.label || value);
      }).join(', ');
    }
    
    if (question.type === 'single') {
      const option = question.options?.find(opt => opt.value === String(answer));
      return language === 'zh' ? (option?.label || String(answer)) : (option?.label_en || option?.label || String(answer));
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
          <CardContent className="p-0">
            <div className="relative">
              {/* Scrollable table container */}
              <div className="overflow-x-auto max-w-full">
                <div className="min-w-[2000px] relative">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="sticky left-0 bg-muted/50 z-10 border-r w-16">ID</TableHead>
                        <TableHead className="w-40">{language === 'zh' ? '提交时间' : 'Submitted'}</TableHead>
                        <TableHead className="w-32">Q1: {language === 'zh' ? 'AI认知' : 'AI Awareness'}</TableHead>
                        <TableHead className="w-40">Q2: {language === 'zh' ? 'AI使用目的' : 'AI Purpose'}</TableHead>
                        <TableHead className="w-28">Q3: {language === 'zh' ? 'AI频率' : 'AI Frequency'}</TableHead>
                        <TableHead className="w-24">Q4: {language === 'zh' ? '设备' : 'Device'}</TableHead>
                        <TableHead className="w-28">Q5: {language === 'zh' ? '平台' : 'Platform'}</TableHead>
                        <TableHead className="w-32">Q6: {language === 'zh' ? '安卓价格' : 'Android Price'}</TableHead>
                        <TableHead className="w-24">Q7: {language === 'zh' ? '语言' : 'Language'}</TableHead>
                        <TableHead className="w-28">Q8: {language === 'zh' ? '字体调节' : 'Font Adjust'}</TableHead>
                        <TableHead className="w-32">Q9: {language === 'zh' ? '字体重要性' : 'Font Important'}</TableHead>
                        <TableHead className="w-28">Q10: {language === 'zh' ? '奖励类型' : 'Reward Type'}</TableHead>
                        <TableHead className="w-24">Q11: {language === 'zh' ? '观看广告' : 'Watch Ads'}</TableHead>
                        <TableHead className="w-24">Q12: {language === 'zh' ? '年龄' : 'Age'}</TableHead>
                        <TableHead className="w-32">Q13: {language === 'zh' ? '婚姻状况' : 'Marital Status'}</TableHead>
                        <TableHead className="w-32">Q14: {language === 'zh' ? '年收入' : 'Income'}</TableHead>
                        <TableHead className="w-24">Q15: {language === 'zh' ? '学历' : 'Education'}</TableHead>
                        <TableHead className="w-28">Q16: {language === 'zh' ? '参与意愿' : 'Participation'}</TableHead>
                        <TableHead className="w-40">Q17: {language === 'zh' ? '联系方式' : 'Contact Info'}</TableHead>
                        <TableHead className="sticky right-0 bg-muted/50 z-20 border-l w-20 text-center shadow-lg">
                          {language === 'zh' ? '详情' : 'Details'}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {responses.map((response) => {
                        const answers = response.answers || parseRawData(response.raw_data)?.answers || {};

                        return (
                          <TableRow key={response.id}>
                            <TableCell className="sticky left-0 bg-background z-10 border-r font-medium">
                              {response.id}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {format(new Date(response.created_at), 'MM-dd HH:mm')}
                            </TableCell>
                            {/* Q1: AI认知 */}
                            <TableCell>
                              <div className="text-xs max-w-32">
                                {getAnswerDisplay(questions.find(q => q.id === 1) || { id: 1, section: '', question: '', type: 'single', options: [] }, answers['1'])}
                              </div>
                            </TableCell>
                            {/* Q2: AI使用目的 */}
                            <TableCell>
                              <div className="text-xs max-w-40">
                                {getAnswerDisplay(questions.find(q => q.id === 2) || { id: 2, section: '', question: '', type: 'multiple', options: [] }, answers['2'])}
                              </div>
                            </TableCell>
                            {/* Q3: AI频率 */}
                            <TableCell>
                              <div className="text-xs max-w-28">
                                {getAnswerDisplay(questions.find(q => q.id === 3) || { id: 3, section: '', question: '', type: 'single', options: [] }, answers['3'])}
                              </div>
                            </TableCell>
                            {/* Q4: 设备 */}
                            <TableCell>
                              <div className="text-xs max-w-24">
                                {getAnswerDisplay(questions.find(q => q.id === 4) || { id: 4, section: '', question: '', type: 'single', options: [] }, answers['4'])}
                              </div>
                            </TableCell>
                            {/* Q5: 平台 */}
                            <TableCell>
                              <div className="text-xs max-w-28">
                                {getAnswerDisplay(questions.find(q => q.id === 5) || { id: 5, section: '', question: '', type: 'single', options: [] }, answers['5'])}
                              </div>
                            </TableCell>
                            {/* Q6: 安卓价格 */}
                            <TableCell>
                              <div className="text-xs max-w-32">
                                {getAnswerDisplay(questions.find(q => q.id === 6) || { id: 6, section: '', question: '', type: 'single', options: [] }, answers['6'])}
                              </div>
                            </TableCell>
                            {/* Q7: 语言 */}
                            <TableCell>
                              <div className="text-xs max-w-24">
                                {getAnswerDisplay(questions.find(q => q.id === 7) || { id: 7, section: '', question: '', type: 'single', options: [] }, answers['7'])}
                              </div>
                            </TableCell>
                            {/* Q8: 字体调节 */}
                            <TableCell>
                              <div className="text-xs max-w-28">
                                {getAnswerDisplay(questions.find(q => q.id === 8) || { id: 8, section: '', question: '', type: 'single', options: [] }, answers['8'])}
                              </div>
                            </TableCell>
                            {/* Q9: 字体重要性 */}
                            <TableCell>
                              <div className="text-xs max-w-32">
                                {getAnswerDisplay(questions.find(q => q.id === 9) || { id: 9, section: '', question: '', type: 'single', options: [] }, answers['9'])}
                              </div>
                            </TableCell>
                            {/* Q10: 奖励类型 */}
                            <TableCell>
                              <div className="text-xs max-w-28">
                                {getAnswerDisplay(questions.find(q => q.id === 10) || { id: 10, section: '', question: '', type: 'single', options: [] }, answers['10'])}
                              </div>
                            </TableCell>
                            {/* Q11: 观看广告 */}
                            <TableCell>
                              <div className="text-xs max-w-24">
                                {getAnswerDisplay(questions.find(q => q.id === 11) || { id: 11, section: '', question: '', type: 'single', options: [] }, answers['11'])}
                              </div>
                            </TableCell>
                            {/* Q12: 年龄 */}
                            <TableCell>
                              <div className="text-xs max-w-24">
                                {getAnswerDisplay(questions.find(q => q.id === 12) || { id: 12, section: '', question: '', type: 'single', options: [] }, answers['12'])}
                              </div>
                            </TableCell>
                            {/* Q13: 婚姻状况 */}
                            <TableCell>
                              <div className="text-xs max-w-32">
                                {getAnswerDisplay(questions.find(q => q.id === 13) || { id: 13, section: '', question: '', type: 'single', options: [] }, answers['13'])}
                              </div>
                            </TableCell>
                            {/* Q14: 年收入 */}
                            <TableCell>
                              <div className="text-xs max-w-32">
                                {getAnswerDisplay(questions.find(q => q.id === 14) || { id: 14, section: '', question: '', type: 'single', options: [] }, answers['14'])}
                              </div>
                            </TableCell>
                            {/* Q15: 学历 */}
                            <TableCell>
                              <div className="text-xs max-w-24">
                                {getAnswerDisplay(questions.find(q => q.id === 15) || { id: 15, section: '', question: '', type: 'single', options: [] }, answers['15'])}
                              </div>
                            </TableCell>
                            {/* Q16: 参与意愿 */}
                            <TableCell>
                              <div className="text-xs max-w-28">
                                {getAnswerDisplay(questions.find(q => q.id === 16) || { id: 16, section: '', question: '', type: 'single', options: [] }, answers['16'])}
                              </div>
                            </TableCell>
                            {/* Q17: 联系方式 */}
                            <TableCell>
                              <div className="text-xs max-w-40 truncate">
                                {getAnswerDisplay(questions.find(q => q.id === 17) || { id: 17, section: '', question: '', type: 'text', options: [] }, answers['17'])}
                              </div>
                            </TableCell>
                            <TableCell className="sticky right-0 bg-background z-20 border-l text-center shadow-lg">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedResponse(response)}
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}