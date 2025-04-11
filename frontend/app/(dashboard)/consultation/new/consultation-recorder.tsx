"use client"

import { useState } from "react"
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

export function ConsultationRecorder() {
  const { toast } = useToast()
  const [isRecording, setIsRecording] = useState(false)
  const [activeTab, setActiveTab] = useState("record")
  const [transcription, setTranscription] = useState("")
  const [language, setLanguage] = useState("english")

  // Simulated waveform data
  const waveformData = Array.from(
    { length: 50 },
    () => Math.random() * (isRecording ? 40 : 5)
  )

  const handleStartRecording = () => {
    setIsRecording(true)
    toast({
      title: "Recording started",
      description: "Speak clearly for best results",
    })

    // Simulate transcription appearing
    const demoText =
      "Patient presents with complaints of persistent headache for the past three days. Pain is described as throbbing and located primarily in the frontal region. Patient reports that pain is worse in the morning and is accompanied by mild nausea. No vomiting or visual disturbances. Patient has been taking over-the-counter ibuprofen with minimal relief. Medical history includes hypertension controlled with lisinopril. Vital signs are within normal limits. Physical examination reveals mild tenderness to palpation over the frontal sinuses."

    let currentText = ""
    const words = demoText.split(" ")

    const interval = setInterval(() => {
      if (words.length > 0) {
        currentText += words.shift() + " "
        setTranscription(currentText)
      } else {
        clearInterval(interval)
      }
    }, 300)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    toast({
      title: "Recording stopped",
      description: "Transcription complete",
    })

    // After a delay, move to the next tab
    setTimeout(() => {
      setActiveTab("review")
    }, 1000)
  }

  const handleGenerateNote = () => {
    toast({
      title: "Generating medical note",
      description: "Using AI to create a structured note",
    })

    // Simulate delay then move to next tab
    setTimeout(() => {
      setActiveTab("note")
    }, 1500)
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
                {waveformData.map((height, index) => (
                  <div
                    key={index}
                    className="h-full w-1 rounded-full bg-teal-500"
                    style={{
                      height: `${height}%`,
                      transition: "height 0.1s ease-in-out",
                    }}
                  />
                ))}
              </div>

              <Button
                size="lg"
                onClick={
                  isRecording ? handleStopRecording : handleStartRecording
                }
                className={isRecording ? "bg-red-500 hover:bg-red-600" : ""}
              >
                {isRecording ? (
                  <>
                    <MicOff className="mr-2 h-5 w-5" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-5 w-5" />
                    Start Recording
                  </>
                )}
              </Button>
            </div>

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
              <h3 className="mb-2 font-medium">Transcription Review</h3>
              <Textarea
                className="min-h-[200px]"
                value={transcription}
                onChange={(e) => setTranscription(e.target.value)}
                placeholder="Edit the transcription if needed..."
              />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("record")}>
                Back to Recording
              </Button>
              <Button onClick={handleGenerateNote}>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Medical Note
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="note" className="mt-4 space-y-4">
            {/* <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">Medical Note Template</h3>
                <Select value={noteTemplate} onValueChange={setNoteTemplate}>
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
                <Button variant="outline" size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save Draft
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
                  <Button variant="outline">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Continue Editing
                  </Button>
                </div>
              </div>
            </div> */}
            <MedicalNotes />
          </TabsContent>
          <TabsContent value="patient-note" className="mt-4 space-y-4">
            <PatientNotes />
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
