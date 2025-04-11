const { AzureOpenAI } = require("openai")
const dotenv = require("dotenv")

dotenv.config()

export async function main() {
  const endpoint =
    process.env["AZURE_OPENAI_ENDPOINT"] ||
    "https://mednotate-hsil-hackathon.openai.azure.com/"
  const apiKey =
    process.env["AZURE_OPENAI_API_KEY"] || "<REPLACE_WITH_YOUR_KEY_VALUE_HERE>"
  const apiVersion = "2024-05-01-preview"
  const deployment = "gpt-4o"

  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment })

  // ↪️ You can change the transcript here
  const transcript = `
Doctor: Good morning. What brings you in today?
Patient: I've been having this persistent cough for the last two weeks.
Doctor: Is it dry or productive?
Patient: Mostly dry, but sometimes there’s a bit of phlegm, especially in the mornings.
Doctor: Any fever or shortness of breath?
Patient: No fever, but I do feel a little winded going up stairs.
Doctor: Do you have a history of asthma or allergies?
Patient: I had mild asthma as a child, but nothing in recent years.
Doctor: Have you noticed any triggers?
Patient: Not really, though it seems worse in the mornings and at night.
`

  const messages = [
    {
      role: "system",
      content:
        "You are a clinical documentation assistant that processes patient-provider conversation transcripts and generates SOAP-style clinical notes. Format your response as a single Markdown code block containing a valid JSON object with the following keys: 'subjective', 'objective', 'assessment', and 'plan'.",
    },
    {
      role: "user",
      content: `You will be given a transcript of a clinical conversation between a patient and a healthcare provider. Your task is to extract and summarize the information into structured SOAP format notes in JSON. The SOAP format includes:

S (Subjective): Patient's reported symptoms, complaints, and history in their own words.
O (Objective): Clinician’s observations, examination findings, vital signs, or test results.
A (Assessment): Clinician’s assessment or diagnosis based on the subjective and objective data.
P (Plan): Proposed next steps, including treatments, tests, referrals, or follow-up instructions.

Respond with a single Markdown code block that contains a JSON object in the following structure:
{
  "subjective": "...",
  "objective": "...",
  "assessment": "...",
  "plan": "..."
}

If a section is not clearly stated in the transcript, make reasonable clinical inferences or leave it empty. Be concise and clinically relevant.

Transcript:
${transcript}`,
    },
  ]

  const result = await client.chat.completions.create({
    messages,
    max_tokens: 800,
    temperature: 0.7,
    top_p: 0.95,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: null,
  })

  console.log(result.choices[0].message.content)
}

main().catch((err) => {
  console.error("The sample encountered an error:", err)
})

module.exports = { main }
