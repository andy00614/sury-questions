import { NextResponse } from 'next/server';
import { getStatistics, initDatabase } from '@/lib/db-postgres';

export async function GET() {
  try {
    await initDatabase();
    const statistics = await getStatistics();
    
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