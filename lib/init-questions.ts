import { hasQuestions, insertQuestion, insertOption } from './db';
import { surveyQuestions } from './survey-data';

export function initializeQuestions() {
  // Check if questions already exist
  if (hasQuestions()) {
    console.log('Questions already initialized');
    return;
  }

  console.log('Initializing survey questions...');
  
  // Insert all questions and their options
  surveyQuestions.forEach((question) => {
    try {
      // Insert question
      insertQuestion(question);
      
      // Insert options if they exist
      if (question.options) {
        question.options.forEach((option, index) => {
          insertOption(question.id, option, index);
        });
      }
      
      console.log(`✓ Question ${question.id} inserted`);
    } catch (error) {
      console.error(`Error inserting question ${question.id}:`, error);
    }
  });
  
  console.log('Survey questions initialized successfully');
}