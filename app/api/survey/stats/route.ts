import { NextResponse } from 'next/server';
import { getAllResponses, getResponsesCount } from '@/lib/db';

export async function GET() {
  try {
    const count = getResponsesCount();
    const responses = getAllResponses();
    
    return NextResponse.json({
      success: true,
      count: count.count,
      responses: responses
    });
  } catch (error) {
    console.error('Error fetching survey stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}