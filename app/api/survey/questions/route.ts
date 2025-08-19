import { NextResponse } from 'next/server';
import { getAllQuestions } from '@/lib/db';

export async function GET() {
  try {
    const questions = getAllQuestions();
    
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