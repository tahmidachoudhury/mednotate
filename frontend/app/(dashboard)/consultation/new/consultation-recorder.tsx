"use client"

import React, { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  AlertCircle,
  ArrowRight,
  Download,
  Languages,
  Mic,
  MicOff,
  Pill,
  Save,
  Share2,
  Stethoscope,
  ThumbsUp,
  Wand2,
} from "lucide-react"
import PatientNotes from "./patient-notes"
import MedicalNotes from "./clinician-notes"
import { getAIMedicalNotes } from "@/app/services/MedicalNotesGenerator"
import { getAIPatientNotes } from "@/app/services/PatientNotesGenerator"

export function ConsultationRecorder() {
  const { toast } = useToast()
  /// State variables
  const [isRecording, setIsRecording] = useState(false)
  const [activeTab, setActiveTab] = useState("record")
  const [transcription, setTranscription] = useState("")
  
  const [medicalNote, setMedicalNote] = useState("")
  const [patientNote, setPatientNote] = useState("")
  const [language, setLanguage] = useState("english")
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordingError, setRecordingError] = useState<string | null>(null)
  const [audioLevel, setAudioLevel] = useState<number[]>(new Array(50).fill(5))
  const [noteTemplate, setNoteTemplate] = useState<"SOAP" | "DAP" | "BIRP" | "Progress">("SOAP")
  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)

  React.useEffect(() => {
    // Cleanup function to stop any ongoing recordings when component unmounts
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    };
  }, [isRecording]);

  const handleStartRecording = async () => {
    try {
      setRecordingError(null)
      audioChunksRef.current = []

      if (typeof window === 'undefined') {
        throw new Error("Audio recording is not available in this environment")
      }

      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error(`Audio recording is not supported in your browser. Please ensure:
          1. You're using HTTPS or localhost
          2. Microphone permissions are not blocked
          3. Your browser is up to date`)
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 1,
          sampleRate: 44100,
        } 
      })

      // Set up audio context and analyser
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      analyserRef.current = analyser

      // Create and configure MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') 
          ? 'audio/webm' 
          : 'audio/mp4',
      })
      
      mediaRecorderRef.current = mediaRecorder
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      // Start recording and visualization
      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
      startVisualization()

      toast({
        title: "Recording started",
        description: "Speak clearly for best results",
      })

    } catch (error: any) {
      console.error("Error starting recording:", error)
      setRecordingError(error.message || "Failed to start recording")
      toast({
        title: "Recording failed",
        description: error.message || "Could not access microphone",
        variant: "destructive",
      })
    }
  }

  const startVisualization = () => {
    const updateVisualizer = () => {
      if (!analyserRef.current || !isRecording) return

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
      analyserRef.current.getByteFrequencyData(dataArray)

      // Calculate average level
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length
      const normalizedLevel = (average / 255) * 100 // Convert to percentage

      setAudioLevel(prev => {
        const newLevels = [...prev.slice(1), normalizedLevel]
        return newLevels
      })

      animationFrameRef.current = requestAnimationFrame(updateVisualizer)
    }

    updateVisualizer()
  }

  const handleStopRecording = async () => {
    if (!mediaRecorderRef.current) {
      setRecordingError("No active recording found")
      return
    }

    // Cancel the animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    mediaRecorderRef.current.onstop = processRecording
    mediaRecorderRef.current.stop()
    mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    setIsRecording(false)
  }

  const processRecording = async () => {
    try {
      setIsProcessing(true);
      const audioBlob = new Blob(audioChunksRef.current, { 
        type: mediaRecorderRef.current?.mimeType || 'audio/webm' 
      });

      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to transcribe audio');
      }

      if (!data.transcription) {
        throw new Error('No transcription received from service');
      }

      setTranscription(data.transcription);

      toast({
        title: "Recording stopped",
        description: "Transcription complete",
      });

      setTimeout(() => {
        setActiveTab("review");
      }, 1000);
    } catch (error: any) {
      console.error("Error processing recording:", error);
      setRecordingError(error.message || "Failed to transcribe audio. Please try again.");
      toast({
        title: "Transcription failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleGenerateNote() {
    // Run the openai API endpoint
    getAIMedicalNotes(noteTemplate)
      .then((soapNote) => {
        console.log("Retrieved SOAP note:", soapNote)
        const result = soapNote
        setMedicalNote(result)
        setActiveTab("note")
      })
      .catch((error) => {
        console.error("Error:", error)
      })
    toast({
      title: "Generating medical note",
      description: "Using AI to create a structured note",
    })

    // Run the openai API endpoint
    getAIPatientNotes()
      .then((soapNote) => {
        console.log("Retrieved SOAP note:", soapNote)
        const result = soapNote
        setPatientNote(result)
      })
      .catch((error) => {
        console.error("Error:", error)
      })
    toast({
      title: "Generating patient note",
      description: "Using AI to create a structured note",
    })
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Consultation Recorder</CardTitle>
            <CardDescription>
              Record, transcribe, and generate medical notes
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[180px]">
                <Languages className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="french">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="record">Record</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
            <TabsTrigger value="note">Medical Note</TabsTrigger>
            <TabsTrigger value="patient-note">Patient Note</TabsTrigger>
          </TabsList>

          <TabsContent value="record" className="mt-4 space-y-4">
            <div className="flex flex-col items-center justify-center gap-6 rounded-lg border-2 border-dashed p-8">
              <div className="text-center">
                <h3 className="mb-2 text-lg font-semibold">
                  {isRecording ? "Recording in Progress" : "Ready to Record"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isRecording
                    ? "Speak clearly. The transcription will appear below."
                    : "Click the button below to start recording the consultation."}
                </p>
              </div>

              {/* Waveform visualization */}
              <div className="flex h-16 w-full items-center justify-center gap-1">
                {audioLevel.map((height, index) => (
                  <div
                    key={index}
                    className="h-full w-1 rounded-full bg-teal-500"
                    style={{
                      height: `${Math.max(5, height)}%`,
                      transition: "height 0.1s ease-in-out",
                    }}
                  />
                ))}
              </div>

              {isProcessing ? (
                <Button disabled className="bg-gray-500 text-lg py-2 px-4">
                  <span className="animate-pulse">Processing audio...</span>
                </Button>
                  ) : isRecording ? (
                  <Button
                  onClick={handleStopRecording}
                  className="bg-red-500 hover:bg-red-600 text-lg py-2 px-4"
                  >
                    <MicOff className="mr-2 h-5 w-5" />
                    Stop Recording
                    </Button>
                    ) : (
                    <Button className="text-lg py-2 px-4" onClick={handleStartRecording}>
                      <Mic className="mr-2 h-5 w-5" />
                      Start Recording
                      </Button>
              )}
              </div>

              {recordingError && (
                <div className="mt-2 text-sm text-red-500">
                  <AlertCircle className="inline-block mr-1 h-4 w-4" />
                  {recordingError}
                  </div>
                )}

            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium">Live Transcription</h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      isRecording ? "bg-red-500" : "bg-gray-300"
                    }`}
                  />
                  {isRecording ? "Recording" : "Idle"}
                </div>
              </div>
              <div className="h-48 overflow-auto rounded-md bg-muted p-4">
                {transcription ? (
                  <p className="text-sm">{transcription}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Transcription will appear here when you start recording...
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="review" className="mt-4 space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <h3 className="mb-2 font-medium">Transcription Review</h3>
                <Select value={noteTemplate} onValueChange={(value) => setNoteTemplate(value as "SOAP" | "DAP" | "BIRP" | "Progress")}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOAP">SOAP</SelectItem>
                    <SelectItem value="DAP">DAP</SelectItem>
                    <SelectItem value="BIRP">BIRP</SelectItem>
                    <SelectItem value="Progress">Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                className="min-h-[200px]"
                value={transcription}
                onChange={(e) => setTranscription(e.target.value)}
                placeholder="Edit the transcription if needed..."
              />
            </div>

            <div className="flex justify-between">
              <Button onClick={() => setActiveTab("record")}>
                Back to Recording
              </Button>
              <Button onClick={handleGenerateNote}>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Medical Note
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="note" className="mt-4 space-y-4">
            <MedicalNotes content={medicalNote} noteFormat={noteTemplate} />
          </TabsContent>
          <TabsContent value="patient-note" className="mt-4 space-y-4">
            <PatientNotes content={patientNote} />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">Medical Note Template</h3>
                <Select value={noteTemplate} onValueChange={(value) => setNoteTemplate(value as "SOAP" | "DAP" | "BIRP" | "Progress")}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="soap">SOAP</SelectItem>
                    <SelectItem value="dap">DAP</SelectItem>
                    <SelectItem value="birp">BIRP</SelectItem>
                    <SelectItem value="progress">Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button className="text-sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save Draft
                </Button>
                <Button className="text-sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <div className="rounded-lg border">
                  <div className="border-b bg-muted px-4 py-2">
                    <h3 className="font-medium">Generated Medical Note</h3>
                  </div>
                  <div className="p-4">
                    <div className="mb-4 space-y-2">
                      <h4 className="font-semibold">Subjective</h4>
                      <p className="text-sm">
                        Patient presents with complaints of persistent headache
                        for the past three days. Pain is described as throbbing
                        and located primarily in the frontal region. Patient
                        reports that pain is worse in the morning and is
                        accompanied by mild nausea. No vomiting or visual
                        disturbances. Patient has been taking over-the-counter
                        ibuprofen with minimal relief.
                      </p>
                    </div>
                    <div className="mb-4 space-y-2">
                      <h4 className="font-semibold">Objective</h4>
                      <p className="text-sm">
                        Vital signs: BP 128/82, HR 76, RR 16, Temp 98.6°F, O2
                        Sat 98%
                        <br />
                        Physical examination reveals mild tenderness to
                        palpation over the frontal sinuses. No periorbital edema
                        or erythema. PERRLA, EOMI. Tympanic membranes clear
                        bilaterally. Oropharynx without erythema or exudate.
                      </p>
                    </div>
                    <div className="mb-4 space-y-2">
                      <h4 className="font-semibold">Assessment</h4>
                      <p className="text-sm">
                        1. Acute sinusitis, likely viral in etiology
                        <br />
                        2. Tension headache, secondary to sinusitis
                        <br />
                        3. Hypertension, controlled on current medication
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Plan</h4>
                      <p className="text-sm">
                        1. Nasal saline irrigation BID
                        <br />
                        2. Acetaminophen 500mg q6h PRN for pain
                        <br />
                        3. Increase fluid intake
                        <br />
                        4. Follow up in 7 days if symptoms persist
                        <br />
                        5. Continue current hypertension medication
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      AI-Extracted Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-teal-600" />
                        <h4 className="font-medium">Symptoms</h4>
                      </div>
                      <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                        <li>Headache (frontal)</li>
                        <li>Nausea (mild)</li>
                        <li>Sinus tenderness</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Pill className="h-4 w-4 text-teal-600" />
                        <h4 className="font-medium">Medications</h4>
                      </div>
                      <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                        <li>Ibuprofen (OTC)</li>
                        <li>Lisinopril (current)</li>
                        <li>Acetaminophen (new)</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-teal-600" />
                        <h4 className="font-medium">Suggested Diagnoses</h4>
                      </div>
                      <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                        <li>Acute sinusitis (viral)</li>
                        <li>Tension headache</li>
                        <li>Hypertension (controlled)</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col gap-2">
                  <Button>
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Approve Note
                  </Button>
                  <Button className="border border-gray-300">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Continue Editing
                  </Button>
                </div>
              </div>
            </div>

          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-3">
        <p className="text-xs text-muted-foreground">
          All recordings and transcriptions are processed securely and comply
          with HIPAA regulations. No patient data is stored on external servers.
        </p>
      </CardFooter>
    </Card>
  )
}
