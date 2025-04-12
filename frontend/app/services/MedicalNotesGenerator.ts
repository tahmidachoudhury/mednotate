"use server"

const { AzureOpenAI } = require("openai")
const dotenv = require("dotenv")

dotenv.config()



export async function getAIMedicalNotes( value : string) {
  const endpoint =
    process.env["AZURE_OPENAI_ENDPOINT"] ||
    "https://mednotate-hsil-hackathon.openai.azure.com/"
  const apiKey = process.env["AZURE_OPENAI_API_KEY"]
  const apiVersion = "2024-05-01-preview"
  const deployment = "gpt-4o"

  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment })

  // ↪️ You can change the transcript here
  const testTranscript = `
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

  const options = {
    "SOAP": "You will be given a transcript of a clinical conversation between a patient and a healthcare provider. Your task is to extract and summarize the information into structured SOAP format notes in markdown. The SOAP format includes: S (Subjective): Patient's reported symptoms, complaints, and history in their own words. O (Objective): Clinician’s observations, examination findings, vital signs, or test results. A (Assessment): Clinician’s assessment or diagnosis based on the subjective and objective data. P (Plan): Proposed next steps, including treatments, tests, referrals, or follow-up instructions. Respond with a single Markdown code block that contains the following structure: ## Subjective ... ## Objective ... ## Assessment ... ## Plan ... If a section is not clearly stated in the transcript, make reasonable clinical inferences or leave it empty. Be concise and clinically relevant. Do not include the backticks.",
    "DAP": "You will be given a transcript of a clinical conversation between a patient and a healthcare provider. Your task is to extract and summarize the information into structured DAP format notes in markdown. The DAP format includes: D (Data): Factual and subjective information shared by the patient, including symptoms, observations, and clinical findings. A (Assessment): The clinician’s interpretation, diagnosis, or impression of the patient’s condition based on the data. P (Plan): Recommended next steps, such as treatment, referrals, medications, or follow-up care. Respond with a single Markdown code block that contains the following structure: ## Data ... ## Assessment ... ## Plan ... If a section is not clearly stated in the transcript, make reasonable clinical inferences or leave it empty. Be concise and clinically relevant. Do not include the backticks.",
    "BIRP": "You will be given a transcript of a clinical conversation between a patient and a healthcare provider. Your task is to extract and summarize the information into structured BIRP format notes in markdown. The BIRP format includes: B (Behavior): The patient’s statements, emotions, symptoms, and behavior during the session. I (Intervention): Actions taken or responses provided by the clinician during the session. R (Response): The patient’s reaction to the clinician’s intervention. P (Plan): The next steps, such as recommended treatments, follow-ups, goals, or referrals. Respond with a single Markdown code block that contains the following structure: ## Behavior ... ## Intervention ... ## Response ... ## Plan ... If a section is not clearly stated in the transcript, make reasonable clinical inferences or leave it empty. Be concise and clinically relevant. Do not include the backticks.",
    "Progress":
      "You will be given a transcript of a clinical conversation between a patient and a healthcare provider. Your task is to extract and summarize the information into structured Progress Note format in markdown. The Progress Note format includes: Description of the patient’s current status, any changes since the last visit, interventions performed, and the patient’s response. It may include observations, clinical updates, treatment effectiveness, and any new concerns or goals. Respond with a single Markdown code block that contains the following structure: ## Progress Note ... If specific elements are not clearly stated in the transcript, make reasonable clinical inferences or leave them out. Be concise and clinically relevant. Do not include the backticks.",
  }

  const messages = [
    {
      role: "system",
      content:
        "You are a clinical documentation assistant that processes patient-provider conversation transcripts and generates SOAP-style clinical notes. Format your response as a single Markdown code block containing the following headers: 'subjective', 'objective', 'assessment', and 'plan'.",
    },
    {
      role: "user",
      content: `${options[value]}

Transcript:
${testTranscript}`,
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
  return result.choices[0].message.content
}

getAIMedicalNotes().catch((err) => {
  console.error("The sample encountered an error:", err)
})
