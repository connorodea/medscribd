# 🏥 Medical Assistant Voice Agent

## ✨ Overview

This **Medical Assistant Voice Agent** is a demo application that showcases the power of conversational AI in healthcare settings. Built with the [Deepgram Voice Agent API](https://developers.deepgram.com/docs/voice-agent) and AWS Bedrock, it provides a seamless voice interface for medical professionals to:

- 📝 **Create Clinical Notes** - Dictate patient encounters and medical observations
- 💊 **Manage Drug Dispatching** - Handle medication prescriptions and pharmacy communications  
- 📅 **Schedule Appointments** - Book and manage patient appointments via voice commands
- 🔄 **Switch Between Providers** - Compare OpenAI GPT-4 vs AWS Bedrock Nova models

## 🎯 Features

### 🗣️ **Voice-First Interface**
- **Real-time Speech Recognition** using Deepgram's Nova-3-Medical model
- **Natural Voice Synthesis** with Deepgram's Aura voices
- **Hands-free Operation** perfect for clinical environments

### 🏥 **Medical Workflow Integration**
- **Clinical Documentation** - Structured note-taking with medical terminology
- **Prescription Management** - Voice-activated drug dispatching workflow
- **Appointment Scheduling** - Intelligent calendar management

### 🎨 **Modern UI/UX**
- **Responsive Design** works on desktop and mobile devices  
- **Real-time Transcription** with live conversation display
- **Visual Feedback** for recording states and AI responses
- **Dark Theme** optimized for medical environments

## 🚀 Getting Started

### 📋 Prerequisites

Before you begin, ensure you have the following:

- 🔑 **Deepgram API Key** - [Sign up here](https://console.deepgram.com/signup)
- ☁️ **AWS Account** with Bedrock access enabled
- 📦 **Node.js v20+** - [Download here](https://nodejs.org/en/download/) (or use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- 🧶 **Package Manager** - npm (included) or [yarn](https://classic.yarnpkg.com/en/docs/install) (optional)

### ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/lawrence-deepgram/Medical-Assistant-Voice-Agent.git
   cd medical-assistant-voice-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables**
   
   Set up your Deepgram API key:
   ```bash
   export DEEPGRAM_API_KEY=your_deepgram_api_key_here
   ```

4. **Configure AWS Bedrock (Optional)**
   
   For AWS Bedrock integration, edit `app/lib/constants.ts` lines 515-516:
   ```javascript
   access_key_id: "YOUR_AWS_ACCESS_KEY_ID", 
   secret_access_key: "YOUR_AWS_SECRET_ACCESS_KEY" 
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   # or 
   yarn dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:3000` to start using the Medical Assistant!

## 🎮 Usage

### 🎤 **Getting Started with Voice Commands**

1. The Voice Agent will greet you after opening the webpage, you can switch between Default and Bedrock mode to test different LLM providers.
2. **Choose your mode**:
   - Say *"Clinical Note"* for medical documentation
   - Say *"Drug Dispatch"* for prescription management  
   - Say *"Scheduling"* for appointment booking
3. **Follow the voice prompts** - the AI will guide you through each workflow
4. **Switch providers anytime** using the Bedrock toggle in the top-right

### 💡 **Example Voice Workflows**

#### Clinical Notes
```
👤 "Start clinical note"
🤖 "What is the patient's name?"
👤 "John Smith"  
🤖 "What is the patient's date of birth?"
👤 "May 15th, 1980"
...continue with medical details
```

#### Drug Dispatch  
```
👤 "Drug dispatch"
🤖 "What is the patient's name?"
👤 "Jane Doe"
🤖 "What medication needs to be dispensed?"
👤 "Lisinopril 10mg, once daily"
...continue with prescription details
```


## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ using Deepgram Voice Agent API**

[⬆️ Back to Top](#-medical-assistant-voice-agent)

</div>
