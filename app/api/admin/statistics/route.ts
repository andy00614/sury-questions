import { NextResponse } from 'next/server';
import { getStatistics } from '@/lib/db';

export async function GET() {
  try {
    const statistics = getStatistics();
    
    return NextResponse.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}