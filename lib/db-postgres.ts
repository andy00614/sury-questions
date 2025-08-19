import { neon } from '@neondatabase/serverless';

// Lazy initialization of database connection
let sql: ReturnType<typeof neon>;

function getSQL() {
  if (!sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }
    sql = neon(process.env.DATABASE_URL);
  }
  return sql;
}

// Initialize database tables
export async function initDatabase() {
  const sql = getSQL();
  // Create survey questions table
  await sql`
    CREATE TABLE IF NOT EXISTS survey_questions (
      id SERIAL PRIMARY KEY,
      section TEXT NOT NULL,
      section_en TEXT,
      question TEXT NOT NULL,
      question_en TEXT,
      type TEXT NOT NULL,
      required BOOLEAN DEFAULT FALSE,
      sort_order INTEGER
    )
  `;

  // Create survey options table
  await sql`
    CREATE TABLE IF NOT EXISTS survey_options (
      id SERIAL PRIMARY KEY,
      question_id INTEGER NOT NULL REFERENCES survey_questions(id),
      value TEXT NOT NULL,
      label TEXT NOT NULL,
      label_en TEXT,
      sort_order INTEGER
    )
  `;

  // Create survey responses table
  await sql`
    CREATE TABLE IF NOT EXISTS survey_responses (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ip_address TEXT,
      user_agent TEXT,
      
      -- Store all answers as JSON for simplicity
      answers JSONB,
      
      -- Raw data backup
      raw_data TEXT
    )
  `;

  // Create indexes for faster queries
  await sql`CREATE INDEX IF NOT EXISTS idx_created_at ON survey_responses(created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_answers ON survey_responses USING GIN (answers)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_question_id ON survey_options(question_id)`;
}

// Save survey response
export async function saveSurveyResponse(data: { answers?: Record<string, unknown>; [key: string]: unknown }, metadata?: { ipAddress?: string; userAgent?: string }) {
  const sql = getSQL();
  // Extract answers from the submitted data
  const answers = data.answers || {};
  
  const result = await sql`
    INSERT INTO survey_responses (
      ip_address,
      user_agent,
      answers,
      raw_data
    ) VALUES (
      ${metadata?.ipAddress || null},
      ${metadata?.userAgent || null},
      ${JSON.stringify(answers)},
      ${JSON.stringify(data)}
    ) RETURNING id
  ` as Array<{ id: number }>;

  return {
    id: result[0].id,
    success: true
  };
}

// Get all survey responses
export async function getAllResponses() {
  const sql = getSQL();
  const responses = await sql`SELECT * FROM survey_responses ORDER BY created_at DESC` as Array<Record<string, unknown>>;
  return responses;
}

// Get responses count
export async function getResponsesCount() {
  const sql = getSQL();
  const result = await sql`SELECT COUNT(*) as count FROM survey_responses` as Array<{ count: number }>;
  return { count: Number(result[0].count) };
}

// Get responses by date range
export async function getResponsesByDateRange(startDate: string, endDate: string) {
  const sql = getSQL();
  const responses = await sql`
    SELECT * FROM survey_responses 
    WHERE created_at >= ${startDate} AND created_at <= ${endDate}
    ORDER BY created_at DESC
  ` as Array<Record<string, unknown>>;
  return responses;
}

// Get all questions with options
export async function getAllQuestions() {
  const sql = getSQL();
  const questions = await sql`
    SELECT * FROM survey_questions 
    ORDER BY sort_order, id
  ` as Array<Record<string, unknown>>;
  
  const questionsWithOptions = await Promise.all(
    questions.map(async (q: Record<string, unknown>) => {
      const options = await sql`
        SELECT * FROM survey_options 
        WHERE question_id = ${q.id} 
        ORDER BY sort_order, id
      ` as Array<Record<string, unknown>>;
      
      return {
        ...q,
        required: q.required === true,
        options: options
      };
    })
  );
  
  return questionsWithOptions;
}

// Insert question
interface QuestionData {
  id: number;
  section: string;
  sectionEn?: string;
  question: string;
  questionEn?: string;
  type: string;
  required?: boolean;
}

export async function insertQuestion(question: QuestionData) {
  const sql = getSQL();
  const result = await sql`
    INSERT INTO survey_questions (
      id, section, section_en, question, question_en, 
      type, required, sort_order
    ) VALUES (
      ${question.id},
      ${question.section},
      ${question.sectionEn || null},
      ${question.question},
      ${question.questionEn || null},
      ${question.type},
      ${question.required || false},
      ${question.id}
    )
    ON CONFLICT (id) DO NOTHING
    RETURNING id
  ` as Array<{ id: number }>;
  
  return result;
}

// Insert option
interface OptionData {
  value: string;
  label: string;
  labelEn?: string;
}

export async function insertOption(questionId: number, option: OptionData, sortOrder: number) {
  const sql = getSQL();
  const result = await sql`
    INSERT INTO survey_options (
      question_id, value, label, label_en, sort_order
    ) VALUES (
      ${questionId},
      ${option.value},
      ${option.label},
      ${option.labelEn || null},
      ${sortOrder}
    )
    RETURNING id
  ` as Array<{ id: number }>;
  
  return result;
}

// Check if questions exist
export async function hasQuestions() {
  const sql = getSQL();
  const result = await sql`SELECT COUNT(*) as count FROM survey_questions` as Array<{ count: number }>;
  return Number(result[0].count) > 0;
}

// Get statistics for dashboard
export async function getStatistics() {
  const sql = getSQL();
  const totalResponsesResult = await sql`SELECT COUNT(*) as count FROM survey_responses` as Array<{ count: number }>;
  const totalResponses = Number(totalResponsesResult[0].count);
  
  const todayResponsesResult = await sql`
    SELECT COUNT(*) as count FROM survey_responses 
    WHERE DATE(created_at) = CURRENT_DATE
  ` as Array<{ count: number }>;
  const todayResponses = Number(todayResponsesResult[0].count);
  
  // Extract statistics from JSON answers
  const deviceStats = await sql`
    SELECT answers->>'4' as device_type, COUNT(*) as count 
    FROM survey_responses 
    WHERE answers->>'4' IS NOT NULL
    GROUP BY answers->>'4'
  ` as Array<{ device_type: string; count: number }>;
  
  const ageStats = await sql`
    SELECT answers->>'12' as age_group, COUNT(*) as count 
    FROM survey_responses 
    WHERE answers->>'12' IS NOT NULL
    GROUP BY answers->>'12'
    ORDER BY answers->>'12'
  ` as Array<{ age_group: string; count: number }>;
  
  const genderStats = await sql`
    SELECT answers->>'13' as gender, COUNT(*) as count 
    FROM survey_responses 
    WHERE answers->>'13' IS NOT NULL
    GROUP BY answers->>'13'
  ` as Array<{ gender: string; count: number }>;
  
  const regionStats: Array<{ region: string; count: number }> = []; // No region data in new structure
  
  const aiUsageStats = await sql`
    SELECT answers->>'1' as ai_agent_awareness, COUNT(*) as count 
    FROM survey_responses 
    WHERE answers->>'1' IS NOT NULL
    GROUP BY answers->>'1'
  ` as Array<{ ai_agent_awareness: string; count: number }>;
  
  const dailyStats = await sql`
    SELECT DATE(created_at) as date, COUNT(*) as count 
    FROM survey_responses 
    GROUP BY DATE(created_at)
    ORDER BY date DESC
    LIMIT 30
  ` as Array<{ date: string; count: number }>;
  
  return {
    totalResponses,
    todayResponses,
    deviceStats: deviceStats.map(d => ({ device_type: d.device_type, count: Number(d.count) })),
    ageStats: ageStats.map(a => ({ age_group: a.age_group, count: Number(a.count) })),
    genderStats: genderStats.map(g => ({ gender: g.gender, count: Number(g.count) })),
    regionStats: regionStats,
    aiUsageStats: aiUsageStats.map(ai => ({ ai_agent_awareness: ai.ai_agent_awareness, count: Number(ai.count) })),
    dailyStats: dailyStats.map(d => ({ date: d.date, count: Number(d.count) }))
  };
}

export default getSQL;