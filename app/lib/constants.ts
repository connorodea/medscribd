import { type AudioConfig, type StsConfig, type Voice } from "app/utils/deepgramUtils";
import { clinicalNotesPrompt } from './medicalPrompts';

const audioConfig: AudioConfig = {
  input: {
    encoding: "linear16",
    sample_rate: 16000,
  },
  output: {
    encoding: "linear16",
    sample_rate: 24000,
    container: "none",
  },
};

const baseConfig = {
  type: "Settings",
  audio: audioConfig,
  agent: {
    listen: { 
      provider: { 
        type: "deepgram",
        model: "nova-3-medical"
      } 
    },
    speak: { 
      provider: {
        type: "deepgram", 
        model: "aura-2-thalia-en"
      }
    },
    think: {
      provider: { type: "open_ai", model: "gpt-4o-mini" },
    },
    greeting: "Hi, I am Aura, your medical assistant! Which task would you like to start with?"
  },
};

// HIMMS Medical Assistant Base Configuration
const himmsConfig = {
  ...baseConfig,
  agent: {
    ...baseConfig.agent,
    context: {
      messages: [
        {
          type: "History",
          role: "user",
          content: "Hi"
        },
        {
          type: "History",
          role: "assistant",
          content: "Hi I am Aura, your Medical Assistant! Which task would you like to start with?"
        },
      ],
    },
    think: {
      ...baseConfig.agent.think,
      prompt: `${clinicalNotesPrompt}

Mode Switching Instructions:
When user says "Start Clinical Note" or switches to Clinical Notes mode:
- Clear previous context
- Follow clinicalNotesPrompt instructions
- Start by asking "What is the patient's name?"

When user says "Start Drug Dispatch" or switches to Drug Dispatch mode:
- Clear previous context
- Follow drugDispatchPrompt instructions
- Start by asking "What is the patient's name?"

When user says "Start Scheduling" or switches to Scheduling mode:
- Clear previous context
- Follow schedulingPrompt instructions
- Start by asking "What is the patient's name?"

IMPORTANT: When switching modes:
1. NEVER keep context from previous mode
2. ALWAYS start with asking for patient name
3. Follow mode-specific prompt exactly
4. Keep responses brief and direct
5. NO welcome messages or explanations when starting new mode`,
      functions: [
        // Demographics Functions
        {
          name: "set_patient_name",
          description: "Set the patient's name in the clinical note or prescription",
          parameters: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "The patient's full name"
              }
            },
            required: ["name"]
          }
        },
        {
          name: "set_date_of_birth",
          description: "Set the patient's date of birth in the clinical note",
          parameters: {
            type: "object",
            properties: {
              dateOfBirth: {
                type: "string",
                description: "Patient's date of birth in MM/DD/YYYY format"
              }
            },
            required: ["dateOfBirth"]
          }
        },
        {
          name: "set_gender",
          description: "Set the patient's gender in the clinical note",
          parameters: {
            type: "object",
            properties: {
              gender: {
                type: "string",
                description: "Patient's gender"
              }
            },
            required: ["gender"]
          }
        },
        {
          name: "set_mrn",
          description: "Set the patient's medical record number in the clinical note or prescription",
          parameters: {
            type: "object",
            properties: {
              mrn: {
                type: "string",
                description: "Patient's medical record number (MRN)"
              }
            },
            required: ["mrn"]
          }
        },
        // Visit Information Functions
        {
          name: "set_visit_date",
          description: "Set the date of visit in the clinical note",
          parameters: {
            type: "object",
            properties: {
              date: {
                type: "string",
                description: "Date of visit in MM/DD/YYYY format"
              }
            },
            required: ["date"]
          }
        },
        {
          name: "set_visit_time",
          description: "Set the time of visit in the clinical note",
          parameters: {
            type: "object",
            properties: {
              time: {
                type: "string",
                description: "Time of visit in HH:MM format"
              }
            },
            required: ["time"]
          }
        },
        {
          name: "set_visit_type",
          description: "Set the type of visit in the clinical note",
          parameters: {
            type: "object",
            properties: {
              visitType: {
                type: "string",
                description: "Type of visit (e.g., Initial, Follow-up, Emergency)"
              }
            },
            required: ["visitType"]
          }
        },
        {
          name: "set_provider_name",
          description: "Set the provider's name in the clinical note",
          parameters: {
            type: "object",
            properties: {
              provider: {
                type: "string",
                description: "Name of the healthcare provider"
              }
            },
            required: ["provider"]
          }
        },
        // Clinical Information Functions
        {
          name: "set_chief_complaint",
          description: "Set the chief complaint in the clinical note",
          parameters: {
            type: "object",
            properties: {
              complaint: {
                type: "string",
                description: "Patient's main complaint or reason for visit"
              }
            },
            required: ["complaint"]
          }
        },
        {
          name: "set_present_illness",
          description: "Set the present illness history in the clinical note",
          parameters: {
            type: "object",
            properties: {
              illness: {
                type: "string",
                description: "History of present illness"
              }
            },
            required: ["illness"]
          }
        },
        {
          name: "set_review_of_systems",
          description: "Set the review of systems in the clinical note",
          parameters: {
            type: "object",
            properties: {
              systems: {
                type: "string",
                description: "Review of systems findings"
              }
            },
            required: ["systems"]
          }
        },
        {
          name: "set_physical_exam",
          description: "Set the physical examination findings in the clinical note",
          parameters: {
            type: "object",
            properties: {
              exam: {
                type: "string",
                description: "Physical examination findings"
              }
            },
            required: ["exam"]
          }
        },
        {
          name: "set_assessment",
          description: "Set the assessment in the clinical note",
          parameters: {
            type: "object",
            properties: {
              assessment: {
                type: "string",
                description: "Clinical assessment or diagnosis"
              }
            },
            required: ["assessment"]
          }
        },
        {
          name: "set_plan",
          description: "Set the treatment plan in the clinical note",
          parameters: {
            type: "object",
            properties: {
              plan: {
                type: "string",
                description: "Treatment plan and recommendations"
              }
            },
            required: ["plan"]
          }
        },
        {
          name: "other_notes",
          description: "Add additional notes that don't fit into other categories",
          parameters: {
            type: "object",
            properties: {
              notes: {
                type: "string",
                description: "Additional notes or information"
              }
            },
            required: ["notes"]
          }
        },
        {
          name: "save_note",
          description: "Save the current clinical note",
          parameters: {
            type: "object",
            properties: {
              confirm: {
                type: "boolean",
                description: "Confirmation flag to save the note (always true)"
              }
            },
            required: ["confirm"]
          }
        },
        {
          name: "clear_note",
          description: "Clear the current clinical note",
          parameters: {
            type: "object",
            properties: {
              confirm: {
                type: "boolean",
                description: "Confirmation flag to clear the note (always true)"
              }
            },
            required: ["confirm"]
          }
        },
        // Drug Dispatch Functions
        {
          name: "set_medication",
          description: "Set the medication name for the prescription",
          parameters: {
            type: "object",
            required: ["medication"],
            properties: {
              medication: {
                type: "string",
                description: "The name of the medication"
              }
            }
          }
        },
        {
          name: "set_dosage",
          description: "Set the dosage for the prescription",
          parameters: {
            type: "object",
            required: ["dosage"],
            properties: {
              dosage: {
                type: "string",
                description: "The dosage of the medication"
              }
            }
          }
        },
        {
          name: "set_frequency",
          description: "Set the frequency for the prescription",
          parameters: {
            type: "object",
            required: ["frequency"],
            properties: {
              frequency: {
                type: "string",
                description: "How often the medication should be taken"
              }
            }
          }
        },
        {
          name: "set_pharmacy",
          description: "Set the pharmacy for the prescription",
          parameters: {
            type: "object",
            required: ["pharmacy"],
            properties: {
              pharmacy: {
                type: "string",
                description: "The name or location of the pharmacy"
              }
            }
          }
        },
        {
          name: "dispatch_prescription",
          description: "Dispatch the current prescription",
          parameters: {
            type: "object",
            properties: {
              confirm: {
                type: "boolean",
                description: "Confirmation flag to dispatch the prescription (always true)"
              }
            },
            required: ["confirm"]
          }   
        },
        {
          name: "clear_prescription",
          description: "Clear the current prescription form",
          parameters: {
            type: "object",
            properties: {
              confirm: {
                type: "boolean",
                description: "Confirmation flag to clear the prescription (always true)"
              }
            },
            required: ["confirm"]
          }
        },
        // Scheduling Functions
        {
          name: "set_appointment_type",
          description: "Set the type of appointment",
          parameters: {
            type: "object",
            required: ["type"],
            properties: {
              type: {
                type: "string",
                description: "The type of appointment (e.g., Follow-up, Initial Consultation, etc.)"
              }
            }
          }
        },
        {
          name: "set_appointment_datetime",
          description: "Set the date and time for the appointment",
          parameters: {
            type: "object",
            required: ["datetime"],
            properties: {
              datetime: {
                type: "string",
                description: "The date and time of the appointment in ISO format"
              }
            }
          }
        },
        {
          name: "set_appointment_duration",
          description: "Set the duration of the appointment (minimum 30 minutes)",
          parameters: {
            type: "object",
            required: ["duration"],
            properties: {
              duration: {
                type: "integer",
                description: "The duration of the appointment in minutes (minimum 30)"
              }
            }
          }
        },
        {
          name: "set_appointment_notes",
          description: "Set any notes for the appointment",
          parameters: {
            type: "object",
            required: ["notes"],
            properties: {
              notes: {
                type: "string",
                description: "Any additional notes for the appointment"
              }
            }
          }
        },
        {
          name: "schedule_appointment",
          description: "Schedule the current appointment",
          parameters: {
            type: "object",
            properties: {
              confirm: {
                type: "boolean",
                description: "Confirmation flag to schedule the appointment (always true)"
              }
            },
            required: ["confirm"]
          }
        },
        {
          name: "clear_appointment",
          description: "Clear the current appointment form",
          parameters: {
            type: "object",
            properties: {
              confirm: {
                type: "boolean",
                description: "Confirmation flag to clear the appointment (always true)"
              }
            },
            required: ["confirm"]
          }
        },
      ],
    },
  },
};

export const stsConfig: StsConfig = himmsConfig as unknown as StsConfig;

export const stsBedrockConfig: StsConfig = {
  ...himmsConfig,
  agent: {
    ...himmsConfig.agent,
          think: {
          ...himmsConfig.agent.think,
            provider: { 
              type: "aws_bedrock", 
              model: "us.amazon.nova-pro-v1:0", 
              credentials: { 
                type: "iam",  // or "sts" if using AWS STS
                region: "us-east-2", 
                access_key_id: "<YOUR_AWS_ACCESS_KEY_ID>", 
                secret_access_key: "<YOUR_AWS_SECRET_ACCESS_KEY>"
                // session_token: "<YOUR_AWS_SESSION_TOKEN>" if using "sts"
              }
            },
            endpoint: {
              url: "https://bedrock-runtime.us-east-2.amazonaws.com/"
            },
      },
    greeting: "Hi, I am Aura, your medical assistant powered by Amazon Bedrock! Which task would you like to start with?"
  }
} as unknown as StsConfig;

// Voice constants
const voiceArcas: Voice = {
  name: "Arcas",
  canonical_name: "aura-arcas-en",
  metadata: {
    accent: "American",
    gender: "Male",
    image: "https://static.deepgram.com/examples/avatars/arcas.jpg",
    color: "#DD0070",
    sample: "https://static.deepgram.com/examples/voices/arcas.mp3",
  },
};

const voiceThalia: Voice = {
  name: "Thalia",
  canonical_name: "aura-2-thalia-en",
  metadata: {
    accent: "American",
    gender: "Female",
    image: "https://static.deepgram.com/examples/avatars/thalia.jpg",
    color: "#DD0070",
    sample: "https://static.deepgram.com/examples/voices/thalia.mp3",
  },
};

const voiceCeleste: Voice = {
  name: "Celeste",
  canonical_name: "aura-2-celeste-es",
  metadata: {
    accent: "Colombian",
    gender: "Female",
    image: "https://static.deepgram.com/examples/avatars/asteria.jpg",
    color: "#949498",
    sample: "https://static.deepgram.com/examples/voices/asteria.mp3",
  },
};

const voiceNestor: Voice = {
  name: "Nestor",
  canonical_name: "aura-2-nestor-es",
  metadata: {
    accent: "Peninsular",
    gender: "Male",
    image: "https://static.deepgram.com/examples/avatars/orion.jpg",
    color: "#949498",
    sample: "https://static.deepgram.com/examples/voices/orion.mp3",
  },
};

type NonEmptyArray<T> = [T, ...T[]];
export const availableVoices: NonEmptyArray<Voice> = [
  voiceThalia,
  voiceArcas,
  voiceCeleste,
  voiceNestor,
];
export const defaultVoice: Voice = availableVoices[0];

export const sharedOpenGraphMetadata = {
  title: "Voice Agent | Deepgram",
  type: "website",
  url: "/",
  description: "Meet Deepgram's Voice Agent API",
};

export const latencyMeasurementQueryParam = "latency-measurement";

// Drug Dispatch Functions
export const drugDispatchFunctions = [
  {
    name: 'set_patient_name',
    description: 'Set the patient name for the prescription',
    parameters: {
      type: 'object',
      required: ['name'],
      properties: {
        name: {
          type: 'string',
          description: 'The patient\'s full name'
        }
      }
    }
  },
  {
    name: 'set_mrn',
    description: 'Set the patient medical record number for the prescription',
    parameters: {
      type: 'object',
      required: ['mrn'],
      properties: {
        mrn: {
          type: 'string',
          description: 'The patient\'s medical record number (MRN)'
        }
      }
    }
  },
  {
    name: 'set_medication',
    description: 'Set the medication name for the prescription',
    parameters: {
      type: 'object',
      required: ['medication'],
      properties: {
        medication: {
          type: 'string',
          description: 'The name of the medication'
        }
      }
    }
  },
  {
    name: 'set_dosage',
    description: 'Set the dosage for the prescription',
    parameters: {
      type: 'object',
      required: ['dosage'],
      properties: {
        dosage: {
          type: 'string',
          description: 'The dosage of the medication'
        }
      }
    }
  },
  {
    name: 'set_frequency',
    description: 'Set the frequency for the prescription',
    parameters: {
      type: 'object',
      required: ['frequency'],
      properties: {
        frequency: {
          type: 'string',
          description: 'How often the medication should be taken'
        }
      }
    }
  },
  {
    name: 'set_pharmacy',
    description: 'Set the pharmacy for the prescription',
    parameters: {
      type: 'object',
      required: ['pharmacy'],
      properties: {
        pharmacy: {
          type: 'string',
          description: 'The name or location of the pharmacy'
        }
      }
    }
  },
  {
    name: 'dispatch_prescription',
    description: 'Dispatch the current prescription',
    parameters: {
      type: 'object',
      properties: {
        confirm: {
          type: "boolean",
          description: "Confirmation flag to dispatch the prescription (always true)"
        }
      },
      required: ["confirm"]
    }
  },
  {
    name: 'clear_prescription',
    description: 'Clear the current prescription form',
    parameters: {
      type: 'object',
      properties: {
        confirm: {
          type: "boolean",
          description: "Confirmation flag to clear the prescription (always true)"
        }
      },
      required: ["confirm"]
    }
  }
];
