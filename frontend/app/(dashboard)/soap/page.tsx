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
import { useToast } from "@/components/ui/use-toast"
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

import { getAIMedicalNotes } from "@/app/services/MedicalNotesGenerator"
import { getAIPatientNotes } from "@/app/services/PatientNotesGenerator"
import { patientSummary, soapNoteMarkdown } from "../notes/soapNote"

export default function Page(){
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
  const ReactMarkdown = React.lazy(() => import("react-markdown"))
  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)

  
  return (
    
    <Card className="border-2">

      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>SOAP Consultation Note</CardTitle>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">Medical Note Template</h3>
        </div>
      </div>
            {/* <CardDescription>
              Record, transcribe, and generate medical notes
              </CardDescription> */}
          </div>
          <div className="flex items-center gap-2">
            
          <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Save className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div>
      <div className="border-b bg-muted px-4 py-2 flex justify-between">
        <h3 className="font-medium">Medical Notes</h3>
      </div>

      <div className="mx-auto">

        <div className="border rounded min-h-96 mb-4 grid gap-4 md:grid-cols-2">
          
            <div
              
              className="w-full h-96 p-4 overflow-auto prose prose-sm max-w-none"
              >
              <ReactMarkdown>{soapNoteMarkdown}</ReactMarkdown>
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

          
        </div>
          
        </div>

       
      </div>
    </div>

    <div>
      <div className="border-b bg-muted px-4 py-2 flex justify-between">
        <h3 className="font-medium">Patient Notes</h3>
      </div>

      <div className="mx-auto">

        <div className="border rounded min-h-96 mb-4">
          
            <div
              
              className="w-full h-96 p-4 overflow-auto prose prose-sm max-w-none"
              >
              <ReactMarkdown>{patientSummary}</ReactMarkdown>
            </div>
          
        </div>

       
      </div>
    </div>

    </CardContent>
                </Card>
      
  )
}