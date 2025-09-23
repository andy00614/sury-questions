# 📚 Figma原型集成到答题系统 - 完整教程

## 目录
1. [系统架构概览](#系统架构概览)
2. [数据库设计与迁移](#数据库设计与迁移)
3. [后端API开发](#后端api开发)
4. [前端组件实现](#前端组件实现)
5. [集成步骤](#集成步骤)
6. [测试与验证](#测试与验证)

---

## 🏗️ 系统架构概览

### 核心概念
- **混合问题类型**: 支持文字题、原型体验题、图片题等
- **体验追踪**: 记录用户在原型上的交互时长和行为
- **条件逻辑**: 基于体验时间触发后续问题

### 架构图
```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   客户端     │────▶│   API层       │────▶│   数据库     │
│             │     │              │     │             │
│ - 问题渲染   │     │ - 问题管理    │     │ - questions │
│ - 原型嵌入   │     │ - 答案收集    │     │ - answers   │
│ - 进度追踪   │     │ - 体验追踪    │     │ - sessions  │
└─────────────┘     └──────────────┘     └─────────────┘
```

---

## 📊 数据库设计与迁移

### Step 1: 扩展questions表

```sql
-- 添加新字段支持多种问题类型
ALTER TABLE questions ADD COLUMN IF NOT EXISTS
  question_type VARCHAR(50) DEFAULT 'choice',
  config JSONB DEFAULT '{}',
  min_interaction_time INTEGER DEFAULT 0;

-- question_type 可选值:
-- 'choice' - 传统选择题
-- 'prototype' - Figma原型体验题
-- 'prototype_then_choice' - 先体验原型，再回答问题
-- 'video' - 视频题
-- 'image' - 图片题
```

### Step 2: 创建体验追踪表

```sql
-- 用户体验会话表
CREATE TABLE IF NOT EXISTS experience_sessions (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  question_id INTEGER REFERENCES questions(id),
  user_identifier VARCHAR(255),
  prototype_url TEXT,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  interaction_duration INTEGER, -- 秒
  interactions JSONB DEFAULT '[]', -- 记录交互事件
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加索引
CREATE INDEX idx_experience_sessions_session_id ON experience_sessions(session_id);
CREATE INDEX idx_experience_sessions_question_id ON experience_sessions(question_id);
```

### Step 3: 扩展answers表

```sql
-- 添加关联字段
ALTER TABLE answers ADD COLUMN IF NOT EXISTS
  experience_session_id INTEGER REFERENCES experience_sessions(id),
  context JSONB DEFAULT '{}'; -- 存储答题上下文信息
```

### 配置数据示例

```json
// questions表的config字段示例

// 原型体验题配置
{
  "prototype": {
    "url": "https://www.figma.com/proto/...",
    "type": "figma",
    "min_experience_time": 30,
    "max_experience_time": 300,
    "fullscreen_enabled": true,
    "show_instructions": true,
    "instructions": {
      "before": "请体验以下交互原型，了解应用的核心功能",
      "during": "您可以点击、滚动、切换页面来探索",
      "after": "体验完成后，请回答以下问题"
    }
  },
  "followup_questions": [
    {
      "id": "ux_rating",
      "text": "您对整体用户体验的评分是？",
      "type": "scale",
      "scale": { "min": 1, "max": 10 }
    }
  ]
}
```

---

## 🔧 后端API开发

### Step 1: 扩展问题API

创建 `app/api/survey/questions-v2/route.ts`:

```typescript
// 问题数据结构
interface QuestionV2 {
  id: number;
  type: 'choice' | 'prototype' | 'prototype_then_choice';
  text: string;
  options?: Option[];
  config?: {
    prototype?: PrototypeConfig;
    validation?: ValidationRules;
  };
}

interface PrototypeConfig {
  url: string;
  type: 'figma' | 'invision' | 'custom';
  min_experience_time?: number;
  instructions?: Instructions;
}
```

### Step 2: 体验追踪API

创建 `app/api/experience/track/route.ts`:

```typescript
// POST /api/experience/track
// 记录体验开始
{
  "action": "start",
  "question_id": 1,
  "session_id": "xxx",
  "prototype_url": "..."
}

// PUT /api/experience/track
// 记录体验事件
{
  "action": "interaction",
  "session_id": "xxx",
  "event": {
    "type": "click",
    "target": "button",
    "timestamp": "..."
  }
}

// POST /api/experience/track
// 记录体验结束
{
  "action": "end",
  "session_id": "xxx",
  "duration": 45
}
```

### Step 3: 答案提交API改造

扩展 `app/api/survey/submit/route.ts`:

```typescript
interface SubmitAnswerV2 {
  question_id: number;
  answer: string | string[];
  experience_session_id?: string;
  context?: {
    experience_duration?: number;
    device_type?: string;
    interaction_count?: number;
  };
}
```

---

## 🎨 前端组件实现

### Step 1: 问题类型渲染器

创建 `components/survey/QuestionRenderer.tsx`:

```typescript
interface QuestionRendererProps {
  question: QuestionV2;
  onAnswer: (answer: any) => void;
  onExperienceComplete?: (sessionId: string) => void;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onAnswer,
  onExperienceComplete
}) => {
  switch (question.type) {
    case 'choice':
      return <ChoiceQuestion {...props} />;

    case 'prototype':
      return <PrototypeExperience {...props} />;

    case 'prototype_then_choice':
      return <PrototypeThenChoice {...props} />;

    default:
      return <DefaultQuestion {...props} />;
  }
};
```

### Step 2: 原型体验组件

创建 `components/survey/PrototypeExperience.tsx`:

```typescript
const PrototypeExperience: React.FC<Props> = ({ config, onComplete }) => {
  const [experienceTime, setExperienceTime] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // 追踪体验时间
  useEffect(() => {
    const timer = setInterval(() => {
      setExperienceTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 检查最小体验时间
  const canProceed = experienceTime >= (config.min_experience_time || 0);

  return (
    <div className="prototype-container">
      <ProgressBar current={experienceTime} min={config.min_experience_time} />

      <iframe
        src={config.url}
        onLoad={() => setIsReady(true)}
      />

      {canProceed && (
        <Button onClick={() => onComplete(sessionId)}>
          Continue to Questions
        </Button>
      )}
    </div>
  );
};
```

### Step 3: 混合问题组件

创建 `components/survey/PrototypeThenChoice.tsx`:

```typescript
const PrototypeThenChoice: React.FC<Props> = ({ question }) => {
  const [stage, setStage] = useState<'experience' | 'question'>('experience');
  const [sessionId, setSessionId] = useState<string>();

  if (stage === 'experience') {
    return (
      <PrototypeExperience
        config={question.config.prototype}
        onComplete={(sid) => {
          setSessionId(sid);
          setStage('question');
        }}
      />
    );
  }

  return (
    <ChoiceQuestion
      question={question}
      experienceSessionId={sessionId}
    />
  );
};
```

---

## 🚀 集成步骤

### Phase 1: 数据库准备 (第1-2天)
1. ✅ 执行数据库迁移脚本
2. ✅ 更新现有questions表数据
3. ✅ 创建测试数据

### Phase 2: 后端开发 (第3-4天)
1. ✅ 实现扩展的问题API
2. ✅ 实现体验追踪API
3. ✅ 更新答案提交逻辑
4. ✅ 添加数据验证

### Phase 3: 前端实现 (第5-7天)
1. ✅ 创建QuestionRenderer组件
2. ✅ 实现PrototypeExperience组件
3. ✅ 集成体验追踪
4. ✅ 更新进度管理

### Phase 4: 集成测试 (第8-9天)
1. ✅ 端到端流程测试
2. ✅ 数据收集验证
3. ✅ 性能优化

### Phase 5: 部署上线 (第10天)
1. ✅ 生产环境数据迁移
2. ✅ 监控配置
3. ✅ 用户培训

---

## 🧪 测试与验证

### 测试用例

```typescript
// 1. 原型加载测试
test('should load prototype iframe correctly', async () => {
  // 验证iframe加载
  // 验证最小体验时间控制
});

// 2. 体验追踪测试
test('should track user interactions', async () => {
  // 验证开始时间记录
  // 验证交互事件记录
  // 验证结束时间记录
});

// 3. 数据提交测试
test('should submit answer with experience context', async () => {
  // 验证答案关联体验会话
  // 验证上下文数据完整性
});
```

### 性能考虑
- **Iframe优化**: 使用lazy loading
- **数据批量提交**: 减少API调用
- **缓存策略**: 缓存原型资源

### 用户体验优化
- **加载状态**: 明确的加载指示器
- **进度提示**: 显示最小体验时间
- **错误处理**: 友好的错误提示

---

## 📝 示例数据

### 创建原型体验题

```sql
INSERT INTO questions (
  question_type,
  text,
  options,
  config
) VALUES (
  'prototype_then_choice',
  'After experiencing the prototype, how would you rate the overall user experience?',
  '[
    {"id": "excellent", "text": "Excellent - Intuitive and smooth"},
    {"id": "good", "text": "Good - Minor improvements needed"},
    {"id": "average", "text": "Average - Several issues"}
  ]'::jsonb,
  '{
    "prototype": {
      "url": "https://www.figma.com/proto/xxx",
      "type": "figma",
      "min_experience_time": 30,
      "instructions": {
        "before": "Please explore all features in the prototype",
        "after": "Now answer the following question"
      }
    }
  }'::jsonb
);
```

---

## 🎯 最佳实践

1. **渐进式集成**: 先在少量问题上测试，逐步扩展
2. **数据备份**: 在迁移前备份所有数据
3. **A/B测试**: 对比传统问题和原型问题的效果
4. **用户反馈**: 收集用户对新功能的反馈
5. **监控指标**: 追踪完成率、体验时长等关键指标

---

## 🤝 需要帮助？

如果在集成过程中遇到问题，可以：
1. 查看示例代码: `/examples/prototype-integration/`
2. 运行测试套件: `npm run test:integration`
3. 查看日志: `/logs/integration.log`

祝集成顺利！ 🚀