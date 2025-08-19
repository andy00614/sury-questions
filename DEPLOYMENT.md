# 部署指南

## 推荐方案：Vercel + Neon PostgreSQL

### 1. 创建 Neon 数据库
1. 访问 [Neon](https://neon.tech)
2. 创建免费账户
3. 创建新的 PostgreSQL 数据库
4. 获取连接字符串

### 2. 环境变量配置
```bash
# .env.local
DATABASE_URL="postgresql://username:password@ep-xxx.neon.tech/neondb?sslmode=require"
```

### 3. 数据库迁移脚本
```sql
-- 创建表结构（PostgreSQL 语法）
CREATE TABLE survey_questions (
  id SERIAL PRIMARY KEY,
  section TEXT NOT NULL,
  section_en TEXT,
  question TEXT NOT NULL,
  question_en TEXT,
  type TEXT NOT NULL,
  required BOOLEAN DEFAULT FALSE,
  sort_order INTEGER
);

CREATE TABLE survey_options (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL REFERENCES survey_questions(id),
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  label_en TEXT,
  sort_order INTEGER
);

CREATE TABLE survey_responses (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address TEXT,
  user_agent TEXT,
  ai_agent_awareness TEXT,
  ai_usage_purpose TEXT,
  ai_usage_frequency TEXT,
  device_type TEXT,
  screen_time INTEGER,
  most_used_app TEXT,
  video_platforms TEXT,
  video_watch_time INTEGER,
  non_video_entertainment TEXT,
  social_platforms TEXT,
  social_media_time INTEGER,
  content_preference TEXT,
  news_sources TEXT,
  news_frequency TEXT,
  knowledge_acquisition TEXT,
  age_group TEXT,
  gender TEXT,
  region TEXT,
  occupation TEXT,
  income_level TEXT,
  raw_data TEXT
);

-- 创建索引
CREATE INDEX idx_created_at ON survey_responses(created_at DESC);
CREATE INDEX idx_region ON survey_responses(region);
CREATE INDEX idx_age_group ON survey_responses(age_group);
CREATE INDEX idx_question_id ON survey_options(question_id);
```

### 4. 部署到 Vercel
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

## 方案二：Cloudflare Pages + D1 (保持 SQLite)

### 1. 安装 Wrangler CLI
```bash
npm install -g wrangler
```

### 2. 创建 D1 数据库
```bash
wrangler d1 create survey-db
```

### 3. 配置 wrangler.toml
```toml
name = "survey-app"

[[d1_databases]]
binding = "DB"
database_name = "survey-db"
database_id = "your-database-id"
```

### 4. 初始化数据库
```bash
wrangler d1 execute survey-db --file=./schema.sql
```

## 数据迁移工具

如果需要迁移现有 SQLite 数据：

1. **导出现有数据**
```bash
sqlite3 survey.db ".dump" > backup.sql
```

2. **转换为 PostgreSQL 格式**（如果选择 Neon）
- 修改 AUTOINCREMENT 为 SERIAL
- 修改布尔值语法
- 调整时间戳格式

## 推荐选择

**对于您的调查问卷应用，我强烈推荐 Vercel + Neon PostgreSQL：**

✅ **简单部署** - 一键部署到 Vercel  
✅ **自动扩展** - 处理流量峰值  
✅ **免费额度** - 足够个人/小型项目使用  
✅ **高可用性** - 99.9% 可用性保证  
✅ **备份** - 自动备份和恢复  

需要我帮您实施迁移吗？