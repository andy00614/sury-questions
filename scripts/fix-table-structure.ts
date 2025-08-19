#!/usr/bin/env tsx

import * as dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function fixTableStructure() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required');
    process.exit(1);
  }

  console.log('🔧 Fixing table structure...');

  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // Drop and recreate the survey_responses table with correct structure
    console.log('📋 Dropping old survey_responses table...');
    await sql`DROP TABLE IF EXISTS survey_responses`;
    
    console.log('📋 Creating new survey_responses table...');
    await sql`
      CREATE TABLE survey_responses (
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

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_created_at ON survey_responses(created_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_answers ON survey_responses USING GIN (answers)`;
    
    console.log('✅ Table structure fixed successfully!');
    
  } catch (error) {
    console.error('❌ Failed to fix table structure:', error);
    process.exit(1);
  }
}

fixTableStructure();