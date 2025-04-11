import { ConsultationRecorder } from "./consultation-recorder"

export default function NewConsultationPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold">New Consultation</h1>
        <p className="text-muted-foreground">Record a consultation and generate a medical note</p>
      </div>

      <ConsultationRecorder />
    </div>
  )
}
