"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { surveyQuestions } from "@/lib/survey-data";
import { Clock, FileText, Users } from "lucide-react";

interface SurveyWelcomeProps {
  onStart: () => void;
}

export default function SurveyWelcome({ onStart }: SurveyWelcomeProps) {
  const estimatedTime = Math.ceil(surveyQuestions.length * 0.5); // 假设每题30秒

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
              市场调查问卷
            </CardTitle>
            <p className="text-gray-600 text-lg">
              欢迎参与我们的AI助手和用户习惯调研
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="font-semibold text-gray-900">{surveyQuestions.length} 道题目</div>
                  <div className="text-sm text-gray-600">简单选择题</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <Clock className="w-8 h-8 text-green-600" />
                <div>
                  <div className="font-semibold text-gray-900">约 {estimatedTime} 分钟</div>
                  <div className="text-sm text-gray-600">完成时间</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                <Users className="w-8 h-8 text-purple-600" />
                <div>
                  <div className="font-semibold text-gray-900">匿名参与</div>
                  <div className="text-sm text-gray-600">隐私保护</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">调查内容包括：</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• AI 助手使用情况和接受程度</li>
                <li>• 设备偏好和使用习惯</li>
                <li>• 奖励机制偏好</li>
                <li>• 基本人口统计信息</li>
              </ul>
            </div>

            <div className="text-center">
              <Button onClick={onStart} size="lg" className="px-8 py-3">
                开始问卷
              </Button>
              <p className="mt-2 text-xs text-gray-500">
                您的回答将帮助我们改善产品体验
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}