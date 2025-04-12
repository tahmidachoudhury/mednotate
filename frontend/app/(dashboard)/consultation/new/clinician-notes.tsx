import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { InlineMarkdownEditor } from "./patient-notes"
import { useState } from "react"

import {
  AlertCircle,
  ArrowRight,
  Download,
  Pill,
  Save,
  Share2,
  Stethoscope,
  ThumbsUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface payload {
  content: string
  noteFormat: string
}

export default function MedicalNotes({
  content,
  noteFormat,
}: payload): JSX.Element {
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">Medical Note Template</h3>
          <Button variant="secondary" disabled>{noteFormat}</Button>
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
            <InlineMarkdownEditor
              noteType="Generated Medical Note"
              markdownPayload={content}
            />
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
      </div>
    </>
  )
}
