export interface QuestionOption {
  value: string;
  label: string;
  labelEn?: string;
}

export interface Question {
  id: number;
  section: string;
  sectionEn: string;
  question: string;
  questionEn: string;
  type: 'single' | 'multiple' | 'text';
  options?: QuestionOption[];
  required?: boolean;
}

export const surveyQuestions: Question[] = [
  {
    id: 1,
    section: "AI Agent 接受程度",
    sectionEn: "AI Agent Acceptance",
    question: "您是否听说过 ChatGPT 或其他 AI 助手（如 Copilot、Gemini 等）？",
    questionEn: "Have you heard of ChatGPT or other AI assistants (e.g., Copilot, Gemini)?",
    type: "single",
    required: true,
    options: [
      { value: "heard_used", label: "听说过并使用", labelEn: "Heard and used" },
      { value: "heard_not_used", label: "听说过但没用过", labelEn: "Heard but never used" },
      { value: "never_heard", label: "没听说过", labelEn: "Never heard" }
    ]
  },
  {
    id: 2,
    section: "AI Agent 接受程度",
    sectionEn: "AI Agent Acceptance",
    question: "如果您用过 AI 助手，您使用它的主要目的是什么？（可多选）",
    questionEn: "If you have used an AI assistant, what is your main purpose? (Select all that apply)",
    type: "multiple",
    options: [
      { value: "work_study", label: "工作/学习", labelEn: "Work/ Study" },
      { value: "entertainment", label: "娱乐/消遣", labelEn: "Entertainment" },
      { value: "practical", label: "生活实用（如查资料、翻译、写作等）", labelEn: "Practical use (e.g., research, translation, writing)" }
    ]
  },
  {
    id: 3,
    section: "AI Agent 接受程度",
    sectionEn: "AI Agent Acceptance",
    question: "您大概多久会用一次 AI 助手？",
    questionEn: "How often do you use an AI assistant?",
    type: "single",
    required: true,
    options: [
      { value: "daily", label: "每天", labelEn: "Daily" },
      { value: "weekly", label: "每周", labelEn: "Weekly" },
      { value: "monthly", label: "每月", labelEn: "Monthly" },
      { value: "rarely", label: "很少/几乎不用", labelEn: "Rarely/Never" }
    ]
  },
  {
    id: 4,
    section: "硬件设备与使用习惯",
    sectionEn: "Device Preferences",
    question: "您使用的是什么设备？",
    questionEn: "What device are you using?",
    type: "single",
    required: true,
    options: [
      { value: "android", label: "安卓", labelEn: "Android" },
      { value: "ios", label: "苹果", labelEn: "iOS Apple" }
    ]
  },
  {
    id: 5,
    section: "硬件设备与使用习惯",
    sectionEn: "Device Preferences",
    question: "您更喜欢使用哪个平台？",
    questionEn: "Which platform do you prefer?",
    type: "single",
    required: true,
    options: [
      { value: "mobile", label: "手机", labelEn: "Mobile" },
      { value: "web", label: "网页版", labelEn: "Web" }
    ]
  },
  {
    id: 6,
    section: "硬件设备与使用习惯",
    sectionEn: "Device Preferences",
    question: "如果是安卓，您的手机大致价格区间是？",
    questionEn: "If Android, what is your phone's approximate price range?",
    type: "single",
    options: [
      { value: "below_300", label: "SGD 300 以下", labelEn: "Below SGD 300" },
      { value: "300_799", label: "SGD 300–799", labelEn: "SGD 300–799" },
      { value: "above_800", label: "SGD 800 以上", labelEn: "Above SGD 800" }
    ]
  },
  {
    id: 7,
    section: "硬件设备与使用习惯",
    sectionEn: "Device Preferences",
    question: "您平时使用 APP 更习惯的语言是？",
    questionEn: "Which language do you usually prefer for apps?",
    type: "single",
    required: true,
    options: [
      { value: "chinese", label: "中文", labelEn: "Chinese" },
      { value: "english", label: "英文", labelEn: "English" },
      { value: "mixed", label: "中英混合", labelEn: "Mixed" }
    ]
  },
  {
    id: 8,
    section: "硬件设备与使用习惯",
    sectionEn: "Device Preferences",
    question: "在使用带有字体调节功能的 APP（例如 WhatsApp、Facebook、Telegram）时，您是否会调整字体大小？",
    questionEn: "When using apps with font size adjustment (e.g., WhatsApp, Facebook, Telegram), do you adjust the font size?",
    type: "single",
    required: true,
    options: [
      { value: "often", label: "经常调整", labelEn: "Often" },
      { value: "sometimes", label: "偶尔调整", labelEn: "Sometimes" },
      { value: "never", label: "从不调整", labelEn: "Never" }
    ]
  },
  {
    id: 9,
    section: "硬件设备与使用习惯",
    sectionEn: "Device Preferences",
    question: "对于学习类应用，你认为字体大小调整功能重要吗？",
    questionEn: "For a learning app, do you think font size adjustment is important?",
    type: "single",
    required: true,
    options: [
      { value: "yes", label: "是", labelEn: "Yes" },
      { value: "no", label: "否", labelEn: "No" }
    ]
  },
  {
    id: 10,
    section: "奖励系统",
    sectionEn: "Incentives & Rewards",
    question: "您喜欢什么类型的奖励？",
    questionEn: "What kind of vouchers do you prefer?",
    type: "single",
    required: true,
    options: [
      { value: "food", label: "餐饮电子礼券", labelEn: "Food E-vouchers" },
      { value: "non_food", label: "非餐饮奖励", labelEn: "Non-Food" }
    ]
  },
  {
    id: 11,
    section: "奖励系统",
    sectionEn: "Incentives & Rewards",
    question: "您愿意通过观看广告来获得奖励吗？",
    questionEn: "Are you willing to watch ads for rewards?",
    type: "single",
    required: true,
    options: [
      { value: "yes", label: "愿意", labelEn: "Yes" },
      { value: "no", label: "不愿意", labelEn: "No" }
    ]
  },
  {
    id: 12,
    section: "人物画像",
    sectionEn: "Demographics",
    question: "您的年龄范围是？",
    questionEn: "What is your age group?",
    type: "single",
    required: true,
    options: [
      { value: "below_18", label: "18岁以下", labelEn: "Below 18" },
      { value: "18_24", label: "18–24", labelEn: "18–24" },
      { value: "25_34", label: "25–34", labelEn: "25–34" },
      { value: "35_44", label: "35–44", labelEn: "35–44" },
      { value: "45_54", label: "45–54", labelEn: "45–54" },
      { value: "55_above", label: "55岁及以上", labelEn: "55 and above" }
    ]
  },
  {
    id: 13,
    section: "人物画像",
    sectionEn: "Demographics",
    question: "您目前的婚姻状况是？",
    questionEn: "What is your current marital status?",
    type: "single",
    required: true,
    options: [
      { value: "single", label: "未婚", labelEn: "Single" },
      { value: "married_no_children", label: "已婚无子女", labelEn: "Married without children" },
      { value: "married_with_children", label: "已婚有子女", labelEn: "Married with children" }
    ]
  },
  {
    id: 14,
    section: "人物画像",
    sectionEn: "Demographics",
    question: "您的年收入范围大致为：",
    questionEn: "What is your approximate annual income?",
    type: "single",
    required: true,
    options: [
      { value: "below_20k", label: "少于 SGD 20,000", labelEn: "Less than SGD 20,000" },
      { value: "20k_50k", label: "SGD 20,000 – 49,999", labelEn: "SGD 20,000 – 49,999" },
      { value: "50k_100k", label: "SGD 50,000 – 99,999", labelEn: "SGD 50,000 – 99,999" },
      { value: "above_100k", label: "SGD 100,000 以上", labelEn: "Above SGD 100,000" }
    ]
  },
  {
    id: 15,
    section: "人物画像",
    sectionEn: "Demographics",
    question: "您的最高学历是？",
    questionEn: "What is your highest education level?",
    type: "single",
    required: true,
    options: [
      { value: "secondary", label: "中学", labelEn: "Secondary" },
      { value: "post_secondary", label: "大专", labelEn: "Post-Secondary" },
      { value: "tertiary", label: "高等教育", labelEn: "Tertiary" }
    ]
  },
  {
    id: 16,
    section: "用户参与意向",
    sectionEn: "User Engagement",
    question: "您有兴趣加入用户测试或抢先体验项目吗？",
    questionEn: "Would you be interested in joining a user testing or early access program?",
    type: "single",
    required: true,
    options: [
      { value: "yes", label: "愿意", labelEn: "Yes" },
      { value: "no", label: "不愿意", labelEn: "No" }
    ]
  },
  {
    id: 17,
    section: "联系信息",
    sectionEn: "Contact Info",
    question: "如果愿意，请留下您的邮箱或联系方式（可选）",
    questionEn: "If willing, please leave your email or contact info (Optional)",
    type: "text",
    required: false
  }
];