# 🚀 Neon PostgreSQL 部署指南

## 📋 第一步：创建 Neon 数据库

1. **注册 Neon 账户**
   - 访问 [neon.tech](https://neon.tech)
   - 使用 GitHub 账户登录（推荐）

2. **创建新项目**
   - 点击 "Create Project"
   - 项目名称：`survey-question`
   - 区域选择：`Asia Pacific (Singapore)` (离中国最近)
   - PostgreSQL 版本：保持默认

3. **获取连接字符串**
   - 在项目仪表板中找到 "Connection Details"
   - 复制 "Connection string"
   - 格式类似：`postgresql://username:password@ep-xxx.neon.tech/neondb?sslmode=require`

## 🔧 第二步：配置本地环境

1. **创建环境变量文件**
   ```bash
   cp .env.example .env.local
   ```

2. **编辑 .env.local**
   ```bash
   # 将你的 Neon 连接字符串粘贴到这里
   DATABASE_URL="postgresql://username:password@ep-xxx.neon.tech/neondb?sslmode=require"
   ```

## 🗄️ 第三步：迁移数据（可选）

如果你有现有的 SQLite 数据需要迁移：

```bash
# 运行迁移脚本
pnpm run migrate
```

如果是全新安装，这个脚本会自动：
- 创建数据库表结构
- 初始化调查问题
- 跳过数据迁移（因为没有现有数据）

## 🧪 第四步：测试连接

```bash
# 启动开发服务器
pnpm run dev
```

访问 http://localhost:3000 测试应用是否正常工作。

## 🚀 第五步：部署到 Vercel

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署项目**
   ```bash
   vercel --prod
   ```

4. **配置环境变量**
   - 在 Vercel 仪表板中
   - 进入 Project Settings > Environment Variables
   - 添加 `DATABASE_URL` 变量，值为你的 Neon 连接字符串

## 📊 数据库结构

迁移后你的 PostgreSQL 数据库将包含：

### 表结构
- `survey_questions` - 调查问题
- `survey_options` - 问题选项  
- `survey_responses` - 用户回答

### 主要特性
- ✅ 完整的中英文支持
- ✅ 多种题型支持（单选、多选、文本）
- ✅ 响应数据统计
- ✅ 管理后台数据分析

## 🔍 验证部署

部署完成后，访问以下链接验证：

- **主页**: `https://your-app.vercel.app` - 调查问卷
- **管理后台**: `https://your-app.vercel.app/admin` - 数据分析

## 📈 监控和维护

### Neon 免费套餐限制
- **存储**: 0.5 GB
- **计算时间**: 144 小时/月
- **活动数据库**: 1 个

### 扩展选项
当需要更多资源时，可以升级到：
- **Pro** ($19/月): 10 GB 存储，300 小时计算时间
- **Scale** ($69/月): 200 GB 存储，750 小时计算时间

## 🆘 故障排除

### 常见问题

1. **连接错误**
   ```
   Error: Connection refused
   ```
   - 检查 DATABASE_URL 是否正确
   - 确认 Neon 数据库状态为活跃

2. **构建错误**
   ```
   Module not found: @neondatabase/serverless
   ```
   - 运行 `pnpm install` 重新安装依赖

3. **迁移失败**
   - 检查 SQLite 文件路径
   - 确认 PostgreSQL 连接正常

### 获取帮助

- **Neon 文档**: https://neon.tech/docs
- **Vercel 文档**: https://vercel.com/docs
- **Next.js 文档**: https://nextjs.org/docs

## 🎉 完成！

你的调查问卷应用现在运行在：
- ✅ Neon PostgreSQL（高可用数据库）
- ✅ Vercel（全球 CDN）  
- ✅ 完整的多语言支持
- ✅ 现代化的技术栈

享受你的新应用吧！🚀