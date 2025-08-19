#!/usr/bin/env tsx

import * as dotenv from 'dotenv';
import Database from 'better-sqlite3';
import { neon } from '@neondatabase/serverless';
import { initDatabase, saveSurveyResponse } from '../lib/db-postgres';
import { initializeQuestions } from '../lib/init-questions-postgres';
import path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function migrateToPostgres() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required');
    process.exit(1);
  }

  console.log('🚀 Starting migration from SQLite to PostgreSQL...');

  try {
    // Initialize PostgreSQL database
    console.log('📋 Initializing PostgreSQL tables...');
    await initDatabase();
    
    console.log('📝 Initializing questions...');
    await initializeQuestions();

    // Open SQLite database
    const sqliteDbPath = path.join(process.cwd(), 'survey.db');
    console.log(`📖 Reading from SQLite database: ${sqliteDbPath}`);
    
    let sqliteDb;
    try {
      sqliteDb = new Database(sqliteDbPath);
    } catch (error) {
      console.log('ℹ️ No existing SQLite database found. Skipping data migration.');
      console.log('✅ PostgreSQL setup complete!');
      return;
    }

    // Check if there are any responses to migrate
    const responsesCount = sqliteDb.prepare('SELECT COUNT(*) as count FROM survey_responses').get() as { count: number };
    
    if (responsesCount.count === 0) {
      console.log('ℹ️ No survey responses found in SQLite database.');
      console.log('✅ PostgreSQL setup complete!');
      sqliteDb.close();
      return;
    }

    console.log(`📊 Found ${responsesCount.count} responses to migrate...`);

    // Get all responses from SQLite
    const responses = sqliteDb.prepare('SELECT * FROM survey_responses ORDER BY id').all();

    console.log('🔄 Migrating responses...');
    let migratedCount = 0;

    for (const response of responses) {
      try {
        // Transform the data format
        const answers: Record<string, unknown> = {};
        const responseData = response as Record<string, unknown>;
        
        // Map the fields back to question IDs
        if (responseData.ai_agent_awareness) answers['1'] = responseData.ai_agent_awareness;
        if (responseData.ai_usage_purpose) answers['2'] = JSON.parse(String(responseData.ai_usage_purpose));
        if (responseData.ai_usage_frequency) answers['3'] = responseData.ai_usage_frequency;
        if (responseData.device_type) answers['4'] = responseData.device_type;
        if (responseData.screen_time) answers['5'] = responseData.screen_time;
        if (responseData.most_used_app) answers['6'] = JSON.parse(String(responseData.most_used_app));
        if (responseData.video_platforms) answers['7'] = JSON.parse(String(responseData.video_platforms));
        if (responseData.video_watch_time) answers['8'] = responseData.video_watch_time;
        if (responseData.non_video_entertainment) answers['9'] = JSON.parse(String(responseData.non_video_entertainment));
        if (responseData.social_platforms) answers['10'] = JSON.parse(String(responseData.social_platforms));
        if (responseData.social_media_time) answers['11'] = responseData.social_media_time;
        if (responseData.content_preference) answers['12'] = JSON.parse(String(responseData.content_preference));
        if (responseData.news_sources) answers['13'] = JSON.parse(String(responseData.news_sources));
        if (responseData.news_frequency) answers['14'] = responseData.news_frequency;
        if (responseData.knowledge_acquisition) answers['15'] = JSON.parse(String(responseData.knowledge_acquisition));
        if (responseData.age_group) answers['16'] = responseData.age_group;
        if (responseData.gender) answers['17'] = responseData.gender;
        if (responseData.region) answers['18'] = responseData.region;
        if (responseData.occupation) answers['19'] = responseData.occupation;
        if (responseData.income_level) answers['20'] = responseData.income_level;

        const migrationData = {
          answers: answers,
          originalTimestamp: responseData.created_at
        };

        const metadata = {
          ipAddress: responseData.ip_address ? String(responseData.ip_address) : undefined,
          userAgent: responseData.user_agent ? String(responseData.user_agent) : undefined
        };

        await saveSurveyResponse(migrationData, metadata);
        migratedCount++;
        
        if (migratedCount % 10 === 0) {
          console.log(`📈 Migrated ${migratedCount}/${responsesCount.count} responses...`);
        }
      } catch (error) {
        console.error(`❌ Error migrating response:`, error);
      }
    }

    sqliteDb.close();

    console.log(`✅ Migration completed successfully!`);
    console.log(`📊 Migrated ${migratedCount} out of ${responsesCount.count} responses`);
    console.log('🎉 Your application is now ready to use PostgreSQL!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateToPostgres();