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

    // Send the audio to Hugging Face's Whisper API
    const response = await fetch(
      'https://api-inference.huggingface.co/models/openai/whisper-large-v3',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HF_ACCESS_TOKEN}`,
          'Content-Type': 'audio/webm',  // Adjust based on your audio format
        },
        body: await audioFile.arrayBuffer(), // Send the raw audio data
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Hugging Face API error:', errorData);
      return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 });
    }

    const result = await response.json();
    // HF Whisper API returns { text: "transcription" }
    return NextResponse.json({ transcription: result.text });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Failed to process audio file' },
      { status: 500 }
    );
  }
}