import { surveyQuestions } from './survey-data';
import { insertQuestion, insertOption, hasQuestions } from './db-postgres';

export async function initializeQuestions() {
  try {
    // Check if questions already exist
    const questionsExist = await hasQuestions();
    if (questionsExist) {
      console.log('Questions already exist in database');
      return;
    }

    console.log('Initializing survey questions in PostgreSQL...');

    for (const question of surveyQuestions) {
      // Insert the question
      await insertQuestion({
        id: question.id,
        section: question.section,
        sectionEn: question.sectionEn,
        question: question.question,
        questionEn: question.questionEn,
        type: question.type,
        required: question.required
      });

      // Insert options if they exist
      if (question.options) {
        for (let i = 0; i < question.options.length; i++) {
          const option = question.options[i];
          await insertOption(question.id, {
            value: option.value,
            label: option.label,
            labelEn: option.labelEn
          }, i + 1);
        }
      }
    }

    console.log(`Successfully initialized ${surveyQuestions.length} questions with their options`);
  } catch (error) {
    console.error('Error initializing questions:', error);
  }
}