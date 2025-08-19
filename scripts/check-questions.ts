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
      const question = q as { id: number; section: string; question: string; type: string; required: boolean; options?: unknown[] };
      console.log(`${index + 1}. [ID: ${question.id}] ${question.section}`);
      console.log(`   Question: ${question.question}`);
      console.log(`   Type: ${question.type}, Required: ${question.required}`);
      console.log(`   Options: ${question.options?.length || 0} options`);
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