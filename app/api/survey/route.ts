import { NextRequest, NextResponse } from 'next/server';
import { saveSurveyResponse } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get metadata
    const metadata = {
      userAgent: request.headers.get('user-agent') || undefined,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined
    };
    
    // Save to database
    const result = saveSurveyResponse(body, metadata);
    
    console.log('Survey submission saved:', {
      id: result.id,
      timestamp: new Date().toISOString(),
      answersCount: Object.keys(body.answers || {}).length
    });

    return NextResponse.json({
      success: true,
      message: '问卷提交成功',
      submissionId: `survey_${result.id}`
    });
  } catch (error) {
    console.error('Survey submission error:', error);
    return NextResponse.json(
      { success: false, message: '提交失败，请重试' },
      { status: 500 }
    );
  }
}