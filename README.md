Harvard-HSIL-Hackathon
Repository for Project of Team#5 Harvard HSIL Hackathon
Mednotate
Mednotate is an AI-powered clinical documentation assistant for healthcare professionals.
Description
Mednotate streamlines the clinical documentation process by converting patient-provider conversations into structured medical notes, reducing administrative burden for healthcare professionals.
Features

Real-time Recording & Transcription: Capture patient encounters with HIPAA-compliant audio recording
AI-Powered Analysis: Extract key medical insights from conversations automatically
Smart Documentation: Generate standardized medical notes in SOAP, DAP, BIRP, and Progress formats
Dual Documentation: Create both clinical and patient-friendly versions of visit summaries
Multi-language Support: Transcribe conversations in English, Spanish, and French
Clinical Insights: View AI-extracted symptoms, medications, and potential diagnoses
User-Friendly Dashboard: Access appointments, note history, and practice analytics

Getting Started
Prerequisites

Node.js (v18 or later)
npm or yarn

Installation

Clone the repository
git clone https://github.com/yourusername/Harvard-HSIL-Hackathon.git
cd Harvard-HSIL-Hackathon

Install dependencies
cd frontend
npm install

Create a .env file based on .env.example with your API keys
Start the development server
npm run dev

Open http://localhost:3000 in your browser

Technologies

Frontend: Next.js, React, Tailwind CSS, shadcn/ui
AI/ML: Azure OpenAI, Hugging Face Whisper
Audio: Web Speech API
State Management: React Context API
Styling: Tailwind CSS

Project Status
This project was developed as part of the Harvard HSIL Hackathon and is currently in prototype stage. Planned enhancements include:

EHR integration capabilities
Expanded specialty-specific templates
Enhanced AI analysis features
Mobile application

Team

Team #5 - Harvard HSIL Hackathon

License
This project is licensed under the MIT License - see the LICENSE file for details.