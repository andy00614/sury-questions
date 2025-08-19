import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'survey.db');
const db = new Database(dbPath);

// Initialize database tables
export function initDatabase() {
  // Create survey questions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS survey_questions (
      id INTEGER PRIMARY KEY,
      section TEXT NOT NULL,
      section_en TEXT,
      question TEXT NOT NULL,
      question_en TEXT,
      type TEXT NOT NULL,
      required INTEGER DEFAULT 0,
      sort_order INTEGER
    )
  `);

  // Create survey options table
  db.exec(`
    CREATE TABLE IF NOT EXISTS survey_options (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER NOT NULL,
      value TEXT NOT NULL,
      label TEXT NOT NULL,
      label_en TEXT,
      sort_order INTEGER,
      FOREIGN KEY (question_id) REFERENCES survey_questions(id)
    )
  `);

  // Create survey responses table
  db.exec(`
    CREATE TABLE IF NOT EXISTS survey_responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip_address TEXT,
      user_agent TEXT,
      
      -- AI Agent Acceptance section
      ai_agent_awareness TEXT,
      ai_usage_purpose TEXT,
      ai_usage_frequency TEXT,
      
      -- Device Preferences section
      device_type TEXT,
      screen_time INTEGER,
      most_used_app TEXT,
      
      -- Entertainment & Media Consumption section
      video_platforms TEXT,
      video_watch_time INTEGER,
      non_video_entertainment TEXT,
      
      -- Social Media Usage section
      social_platforms TEXT,
      social_media_time INTEGER,
      content_preference TEXT,
      
      -- Information Acquisition section
      news_sources TEXT,
      news_frequency TEXT,
      knowledge_acquisition TEXT,
      
      -- Demographics section
      age_group TEXT,
      gender TEXT,
      region TEXT,
      occupation TEXT,
      income_level TEXT,
      
      -- Complete JSON data for reference
      raw_data TEXT
    )
  `);

  // Create indexes for faster queries
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_created_at ON survey_responses(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_region ON survey_responses(region);
    CREATE INDEX IF NOT EXISTS idx_age_group ON survey_responses(age_group);
    CREATE INDEX IF NOT EXISTS idx_question_id ON survey_options(question_id);
  `);
}

// Save survey response
export function saveSurveyResponse(data: any, metadata?: { ipAddress?: string; userAgent?: string }) {
  const stmt = db.prepare(`
    INSERT INTO survey_responses (
      ip_address,
      user_agent,
      ai_agent_awareness,
      ai_usage_purpose,
      ai_usage_frequency,
      device_type,
      screen_time,
      most_used_app,
      video_platforms,
      video_watch_time,
      non_video_entertainment,
      social_platforms,
      social_media_time,
      content_preference,
      news_sources,
      news_frequency,
      knowledge_acquisition,
      age_group,
      gender,
      region,
      occupation,
      income_level,
      raw_data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Extract answers from the submitted data
  const answers = data.answers || {};
  
  const result = stmt.run(
    metadata?.ipAddress || null,
    metadata?.userAgent || null,
    answers['1'] || null, // ai_agent_awareness
    JSON.stringify(answers['2']) || null, // ai_usage_purpose (multiple choice)
    answers['3'] || null, // ai_usage_frequency
    answers['4'] || null, // device_type
    answers['5'] || null, // screen_time
    JSON.stringify(answers['6']) || null, // most_used_app (multiple choice)
    JSON.stringify(answers['7']) || null, // video_platforms (multiple choice)
    answers['8'] || null, // video_watch_time
    JSON.stringify(answers['9']) || null, // non_video_entertainment (multiple choice)
    JSON.stringify(answers['10']) || null, // social_platforms (multiple choice)
    answers['11'] || null, // social_media_time
    JSON.stringify(answers['12']) || null, // content_preference (multiple choice)
    JSON.stringify(answers['13']) || null, // news_sources (multiple choice)
    answers['14'] || null, // news_frequency
    JSON.stringify(answers['15']) || null, // knowledge_acquisition (multiple choice)
    answers['16'] || null, // age_group
    answers['17'] || null, // gender
    answers['18'] || null, // region
    answers['19'] || null, // occupation
    answers['20'] || null, // income_level
    JSON.stringify(data) // raw_data for reference
  );

  return {
    id: result.lastInsertRowid,
    success: true
  };
}

// Get all survey responses
export function getAllResponses() {
  const stmt = db.prepare('SELECT * FROM survey_responses ORDER BY created_at DESC');
  return stmt.all();
}

// Get responses count
export function getResponsesCount() {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM survey_responses');
  return stmt.get() as { count: number };
}

// Get responses by date range
export function getResponsesByDateRange(startDate: string, endDate: string) {
  const stmt = db.prepare(`
    SELECT * FROM survey_responses 
    WHERE created_at >= ? AND created_at <= ?
    ORDER BY created_at DESC
  `);
  return stmt.all(startDate, endDate);
}

// Get all questions with options
export function getAllQuestions() {
  const questions = db.prepare(`
    SELECT * FROM survey_questions 
    ORDER BY sort_order, id
  `).all();
  
  const getOptions = db.prepare(`
    SELECT * FROM survey_options 
    WHERE question_id = ? 
    ORDER BY sort_order, id
  `);
  
  return questions.map((q: any) => ({
    ...q,
    required: q.required === 1,
    options: getOptions.all(q.id)
  }));
}

// Insert question
export function insertQuestion(question: any) {
  const stmt = db.prepare(`
    INSERT INTO survey_questions (
      id, section, section_en, question, question_en, 
      type, required, sort_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  return stmt.run(
    question.id,
    question.section,
    question.sectionEn || null,
    question.question,
    question.questionEn || null,
    question.type,
    question.required ? 1 : 0,
    question.id // use id as sort_order
  );
}

// Insert option
export function insertOption(questionId: number, option: any, sortOrder: number) {
  const stmt = db.prepare(`
    INSERT INTO survey_options (
      question_id, value, label, label_en, sort_order
    ) VALUES (?, ?, ?, ?, ?)
  `);
  
  return stmt.run(
    questionId,
    option.value,
    option.label,
    option.labelEn || null,
    sortOrder
  );
}

// Check if questions exist
export function hasQuestions() {
  const result = db.prepare('SELECT COUNT(*) as count FROM survey_questions').get() as { count: number };
  return result.count > 0;
}

// Initialize database on module load
initDatabase();

// Initialize questions after database is ready
import('./init-questions').then(({ initializeQuestions }) => {
  initializeQuestions();
}).catch(console.error);

export default db;