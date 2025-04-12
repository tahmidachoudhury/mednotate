"use server"

const { AzureOpenAI } = require("openai")
const dotenv = require("dotenv")

dotenv.config()

export async function getAIPatientNotes() {
  const endpoint =
    process.env["AZURE_OPENAI_ENDPOINT"] ||
    "https://mednotate-hsil-hackathon.openai.azure.com/"
  const apiKey = process.env["AZURE_OPENAI_API_KEY"]
  const apiVersion = "2024-05-01-preview"
  const deployment = "gpt-4o" // or whatever your deployment name is

  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment })

  // 🔄 Example SOAP-style clinician notes
  const clinicianNotes = {
    subjective:
      "Patient reports a persistent dry cough for two weeks, occasionally productive in the mornings. No fever. Mild shortness of breath on exertion. Past history of childhood asthma.",
    objective:
      "Alert and oriented. No obvious respiratory distress. No vitals or physical exam noted in transcript.",
    assessment:
      "Likely upper respiratory tract infection or mild reactive airway disease. Differential includes post-viral cough.",
    plan: "Supportive care. Monitor symptoms. Increase fluid intake. Consider inhaler if symptoms persist. Follow-up in 1 week if no improvement.",
  }

  const messages = [
    {
      role: "system",
      content:
        "You are a health assistant that helps explain clinical notes in simple language for patients. Your job is to convert structured clinical notes into easy-to-understand summaries that a patient with no medical background can read and understand.",
    },
    {
      role: "user",
      content: `Here are the doctor's notes from your recent visit:

${JSON.stringify(clinicianNotes, null, 2)}

Please summarize this in a patient-friendly format. Keep it clear, empathetic, and free of medical jargon. Be conversational but professional.`,
    },
  ]

  const result = await client.chat.completions.create({
    messages,
    max_tokens: 500,
    temperature: 0.75,
    top_p: 0.9,
    frequency_penalty: 0,
    presence_penalty: 0,
  })

  console.log("📝 Patient Summary:")
  console.log(result.choices[0].message.content)
  return result.choices[0].message.content
}

getAIPatientNotes().catch((err) => {
  console.error("The sample encountered an error:", err)
})
