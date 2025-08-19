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
        const answers: Record<string, any> = {};
        
        // Map the fields back to question IDs
        if (response.ai_agent_awareness) answers['1'] = response.ai_agent_awareness;
        if (response.ai_usage_purpose) answers['2'] = JSON.parse(response.ai_usage_purpose);
        if (response.ai_usage_frequency) answers['3'] = response.ai_usage_frequency;
        if (response.device_type) answers['4'] = response.device_type;
        if (response.screen_time) answers['5'] = response.screen_time;
        if (response.most_used_app) answers['6'] = JSON.parse(response.most_used_app);
        if (response.video_platforms) answers['7'] = JSON.parse(response.video_platforms);
        if (response.video_watch_time) answers['8'] = response.video_watch_time;
        if (response.non_video_entertainment) answers['9'] = JSON.parse(response.non_video_entertainment);
        if (response.social_platforms) answers['10'] = JSON.parse(response.social_platforms);
        if (response.social_media_time) answers['11'] = response.social_media_time;
        if (response.content_preference) answers['12'] = JSON.parse(response.content_preference);
        if (response.news_sources) answers['13'] = JSON.parse(response.news_sources);
        if (response.news_frequency) answers['14'] = response.news_frequency;
        if (response.knowledge_acquisition) answers['15'] = JSON.parse(response.knowledge_acquisition);
        if (response.age_group) answers['16'] = response.age_group;
        if (response.gender) answers['17'] = response.gender;
        if (response.region) answers['18'] = response.region;
        if (response.occupation) answers['19'] = response.occupation;
        if (response.income_level) answers['20'] = response.income_level;

        const migrationData = {
          answers: answers,
          originalTimestamp: response.created_at
        };

        const metadata = {
          ipAddress: response.ip_address,
          userAgent: response.user_agent
        };

        await saveSurveyResponse(migrationData, metadata);
        migratedCount++;
        
        if (migratedCount % 10 === 0) {
          console.log(`📈 Migrated ${migratedCount}/${responsesCount.count} responses...`);
        }
      } catch (error) {
        console.error(`❌ Error migrating response ${response.id}:`, error);
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