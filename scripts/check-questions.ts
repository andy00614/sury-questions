#!/usr/bin/env tsx

import * as dotenv from 'dotenv';
import { getAllQuestions } from '../lib/db-postgres';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function checkQuestions() {
  try {
    console.log('🔍 Checking questions in database...');
    
    const questions = await getAllQuestions();
    
    console.log(`📊 Found ${questions.length} questions in database:`);
    console.log('');
    
    questions.forEach((q, index) => {
      console.log(`${index + 1}. [ID: ${q.id}] ${q.section}`);
      console.log(`   Question: ${q.question}`);
      console.log(`   Type: ${q.type}, Required: ${q.required}`);
      console.log(`   Options: ${q.options?.length || 0} options`);
      console.log('');
    });
    
    console.log(`✅ Total questions in database: ${questions.length}`);
    console.log(`🎯 Expected questions: 17`);
    
    if (questions.length === 17) {
      console.log('🎉 All questions are properly loaded!');
    } else {
      console.log(`⚠️ Missing ${17 - questions.length} questions`);
    }
    
  } catch (error) {
    console.error('❌ Error checking questions:', error);
  }
}

checkQuestions();