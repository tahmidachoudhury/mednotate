import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as Blob;

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Log the received file details
    console.log('Received audio file:', {
      size: audioFile.size,
      type: audioFile.type,
    });

    const response = await fetch(
      'https://api-inference.huggingface.co/models/openai/whisper-large-v3',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HF_ACCESS_TOKEN}`,
          'Content-Type': 'audio/webm',
        },
        body: await audioFile.arrayBuffer(),
      }
    );

    // First try to get the text response to check for HTML error pages
    const responseText = await response.text();
    
    let result;
    try {
      // Try to parse as JSON
      result = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response as JSON:', responseText.slice(0, 200));
      return NextResponse.json({ 
        error: 'Invalid response from transcription service' 
      }, { status: 500 });
    }

    if (!response.ok) {
      console.error('Hugging Face API error:', result);
      return NextResponse.json({ 
        error: `Transcription failed: ${result.error || 'Unknown error'}` 
      }, { status: 500 });
    }

    return NextResponse.json({ transcription: result.text });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Failed to process audio file' },
      { status: 500 }
    );
  }
}