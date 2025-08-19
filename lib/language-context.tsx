"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, zhText?: string, enText?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 翻译字典
const translations = {
  zh: {
    // 主页欢迎页面
    'welcome.title': '市场调查问卷',
    'welcome.subtitle': '您的意见对我们至关重要',
    'welcome.questions': '个问题',
    'welcome.time': '5-10分钟',
    'welcome.privacy': '隐私保护',
    'welcome.features.designed': '精心设计',
    'welcome.features.quick': '快速完成',
    'welcome.features.secure': '安全可靠',
    'welcome.preview.title': '调查内容预览',
    'welcome.preview.ai': 'AI 接受程度',
    'welcome.preview.device': '设备使用习惯',
    'welcome.preview.media': '媒体消费行为',
    'welcome.preview.social': '社交媒体偏好',
    'welcome.preview.info': '信息获取方式',
    'welcome.preview.demo': '人口统计信息',
    'welcome.start': '开始调查',
    
    // 问卷表单
    'survey.loading': '加载问卷中...',
    'survey.no_questions': '暂无问卷题目',
    'survey.question': '问题',
    'survey.required': '必填',
    'survey.previous': '上一题',
    'survey.next': '下一题',
    'survey.submit': '提交问卷',
    'survey.success.title': '提交成功！',
    'survey.success.message': '感谢您参与我们的市场调查',
    'survey.placeholder.text': '请输入您的回答...',
    
    // 后台页面
    'admin.title': '数据分析后台',
    'admin.back': '返回问卷',
    'admin.total_responses': '总响应数',
    'admin.today_responses': '今日响应',
    'admin.device_types': '设备类型',
    'admin.daily_average': '平均每日',
    'admin.gender_distribution': '性别分布',
    'admin.age_distribution': '年龄分布',
    'admin.ai_awareness': 'AI助手认知度',
    'admin.daily_trend': '每日提交趋势',
    'admin.recent_data': '最近提交的调查数据',
    'admin.table.id': 'ID',
    'admin.table.time': '提交时间',
    'admin.table.gender': '性别',
    'admin.table.age': '年龄段',
    'admin.table.region': '地区',
    'admin.table.device': '设备类型',
    'admin.table.ai_awareness': 'AI认知',
    
    // 通用
    'common.loading': '加载中...',
    'common.error': '出错了',
    'common.retry': '重试',
    'common.close': '关闭',
    
    // 设备类型
    'device.android': '安卓',
    'device.ios': '苹果',
    
    // 性别
    'gender.male': '男性',
    'gender.female': '女性',
    'gender.other': '其他',
    
    // 年龄段
    'age.under_18': '18岁以下',
    'age.18_24': '18-24岁',
    'age.25_34': '25-34岁',
    'age.35_44': '35-44岁',
    'age.45_54': '45-54岁',
    'age.55_plus': '55岁以上',
    
    // AI认知度
    'ai.heard_used': '听说过并使用',
    'ai.heard_not_used': '听说过但没用过',
    'ai.never_heard': '没听说过'
  },
  en: {
    // 主页欢迎页面
    'welcome.title': 'Market Research Survey',
    'welcome.subtitle': 'Your opinion matters to us',
    'welcome.questions': 'questions',
    'welcome.time': '5-10 minutes',
    'welcome.privacy': 'Privacy Protected',
    'welcome.features.designed': 'Well Designed',
    'welcome.features.quick': 'Quick Complete',
    'welcome.features.secure': 'Safe & Secure',
    'welcome.preview.title': 'Survey Content Preview',
    'welcome.preview.ai': 'AI Acceptance',
    'welcome.preview.device': 'Device Usage',
    'welcome.preview.media': 'Media Consumption',
    'welcome.preview.social': 'Social Media',
    'welcome.preview.info': 'Information Access',
    'welcome.preview.demo': 'Demographics',
    'welcome.start': 'Start Survey',
    
    // 问卷表单
    'survey.loading': 'Loading survey...',
    'survey.no_questions': 'No survey questions available',
    'survey.question': 'Question',
    'survey.required': 'Required',
    'survey.previous': 'Previous',
    'survey.next': 'Next',
    'survey.submit': 'Submit Survey',
    'survey.success.title': 'Submitted Successfully!',
    'survey.success.message': 'Thank you for participating in our market research',
    'survey.placeholder.text': 'Please enter your answer...',
    
    // 后台页面
    'admin.title': 'Data Analytics Dashboard',
    'admin.back': 'Back to Survey',
    'admin.total_responses': 'Total Responses',
    'admin.today_responses': 'Today\'s Responses',
    'admin.device_types': 'Device Types',
    'admin.daily_average': 'Daily Average',
    'admin.gender_distribution': 'Gender Distribution',
    'admin.age_distribution': 'Age Distribution',
    'admin.ai_awareness': 'AI Assistant Awareness',
    'admin.daily_trend': 'Daily Submission Trend',
    'admin.recent_data': 'Recent Survey Data',
    'admin.table.id': 'ID',
    'admin.table.time': 'Submission Time',
    'admin.table.gender': 'Gender',
    'admin.table.age': 'Age Group',
    'admin.table.region': 'Region',
    'admin.table.device': 'Device Type',
    'admin.table.ai_awareness': 'AI Awareness',
    
    // 通用
    'common.loading': 'Loading...',
    'common.error': 'Error occurred',
    'common.retry': 'Retry',
    'common.close': 'Close',
    
    // 设备类型
    'device.android': 'Android',
    'device.ios': 'iOS',
    
    // 性别
    'gender.male': 'Male',
    'gender.female': 'Female',
    'gender.other': 'Other',
    
    // 年龄段
    'age.under_18': 'Under 18',
    'age.18_24': '18-24',
    'age.25_34': '25-34',
    'age.35_44': '35-44',
    'age.45_54': '45-54',
    'age.55_plus': '55+',
    
    // AI认知度
    'ai.heard_used': 'Heard and Used',
    'ai.heard_not_used': 'Heard but Never Used',
    'ai.never_heard': 'Never Heard'
  }
};

// 检测浏览器语言
function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  
  const lang = navigator.language || navigator.languages?.[0] || 'en';
  return lang.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

// 从本地存储获取语言设置
function getStoredLanguage(): Language | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem('survey-language');
  return stored === 'zh' || stored === 'en' ? stored : null;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // 首先检查本地存储，如果没有则检测浏览器语言
    const storedLang = getStoredLanguage();
    const initialLang = storedLang || detectBrowserLanguage();
    
    setLanguageState(initialLang);
    setIsInitialized(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('survey-language', lang);
  };

  // 翻译函数，支持三种方式：
  // 1. 使用预定义的翻译key
  // 2. 直接传入中英文文本
  // 3. 从数据库数据中选择对应语言字段
  const t = (key: string, zhText?: string, enText?: string): string => {
    // 如果提供了直接的中英文文本，使用它们
    if (zhText && enText) {
      return language === 'zh' ? zhText : enText;
    }
    
    // 使用预定义的翻译
    const translation = translations[language]?.[key];
    if (translation) {
      return translation;
    }
    
    // 如果都没有，返回key本身
    return key;
  };

  // 在初始化完成前显示加载状态
  if (!isInitialized) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}