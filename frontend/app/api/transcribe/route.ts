import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioBlob = formData.get('audio') as Blob;
    
    if (!audioBlob) {
      return NextResponse.json({ error: 'Audio file is required' }, { status: 400 });
    }

    // Create a FormData object to send to OpenAI
    const openAIFormData = new FormData();
    openAIFormData.append('file', audioBlob, 'recording.webm');
    openAIFormData.append('model', 'whisper-large-v3-turbo');
    
    // Send the audio to OpenAI's Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: openAIFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Whisper API error:', errorData);
      return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 });
    }

    const result = await response.json();
    return NextResponse.json({ transcription: result.text });
  } catch (error) {
    console.error('Error in transcription route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}