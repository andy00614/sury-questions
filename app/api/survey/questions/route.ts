import { NextResponse } from 'next/server';
import { getAllQuestions, initDatabase } from '@/lib/db-postgres';
import { initializeQuestions } from '@/lib/init-questions-postgres';

export async function GET() {
  try {
    await initDatabase();
    await initializeQuestions();
    const questions = await getAllQuestions();
    
    return NextResponse.json({
      success: true,
      questions: questions
    });
  } catch (error) {
    console.error('Error fetching survey questions:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}