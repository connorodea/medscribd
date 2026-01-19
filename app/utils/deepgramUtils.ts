import { convertFloat32ToInt16, downsample } from "../utils/audioUtils";
import nextConfig from "next.config.mjs";

export const getApiKey = async (): Promise<string> => {
  try {
    const result = await (
      await fetch(withBasePath("/api/authenticate"), { method: "POST" })
    ).json();
    return result.key;
  } catch (error) {
    console.error("failed to create API key", error);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return getApiKey();
  }
};

export const sendMicToSocket = (socket: WebSocket) => (event: AudioProcessingEvent) => {
  const inputData = event?.inputBuffer?.getChannelData(0);
  const downsampledData = downsample(inputData, 48000, 16000);
  const audioDataToSend = convertFloat32ToInt16(downsampledData);
  socket.send(audioDataToSend);
};

export const sendSocketMessage = (socket: WebSocket, message: DGMessage) => {
  console.debug("=== SENDING WEBSOCKET MESSAGE ===");
  console.debug("Message type:", message.type);
  console.debug("Full message:", message);
  console.debug("Stringified:", JSON.stringify(message));
  console.debug("Socket state:", socket.readyState);
  
  socket.send(JSON.stringify(message));
};

export const sendKeepAliveMessage = (socket: WebSocket) => () => {
  sendSocketMessage(socket, { type: "KeepAlive" });
};

export interface AudioConfig {
  input: {
    encoding: string;
    sample_rate: number;
  };
  output: {
    encoding: string;
    sample_rate: number;
    container?: string;
    buffer_size?: number;
  };
}

export interface AWSPollyCredentialsConfig {
  type: string;
  region: string;
  access_key_id: string;
  secret_access_key: string;
  session_token?: string;
}

export interface CartesiaConfig {
  mode: string;
  id: string;
}

export interface ProviderConfig {
  type?: string
  model?: string;
  temperature?: number;
  model_id?: string;
  voice?: CartesiaConfig;
  keyterms?: string[];
  smart_format?: boolean;
  language?: string;
  language_code?: string;
  engine?: string;
  credentials?: AWSPollyCredentialsConfig;
}

export interface AgentConfig {
  language?: string;
  context?: ContextConfig;
  listen: { provider: ProviderConfig };
  think: {
    provider: ProviderConfig;
    endpoint?: { url: string; headers: Record<string, string> };
    context_length?: number;
    prompt: string;
    functions?: LlmFunction[];
  };
  speak: {
    provider: ProviderConfig;
    endpoint?: string;
  };
  greeting?: string;
}

export interface ContextConfig {
  messages: { type: string; role: string; content: string }[];
}

export interface StsConfig {
  type: string;
  audio: AudioConfig;
  agent: AgentConfig;
  context?: ContextConfig;
}

export interface LlmFunction {
  name: string;
  description: string;
  url?: string;
  method?: string;
  headers?: Header[];
  key?: string;
  parameters: LlmParameterObject | Record<string, never>;
}

export type LlmParameter = LlmParameterScalar | LlmParameterObject;

export interface LlmParameterBase {
  type: string;
  description?: string;
}

export interface LlmParameterObject extends LlmParameterBase {
  type: "object";
  properties: Record<string, LlmParameter>;
  required?: string[];
}

export interface LlmParameterScalar extends LlmParameterBase {
  type: "string" | "integer";
}

export interface Header {
  key: string;
  value: string;
}

export interface Voice {
  name: string;
  canonical_name: string;
  metadata: {
    accent: string;
    gender: string;
    image: string;
    color: string;
    sample: string;
  };
}

export interface SpeakConfig {
  provider: ProviderConfig;
}

export interface FunctionCallRequestConfig {
  id: string;
  name: string;
  arguments: string;
  client_side: boolean;
}

export type DGMessage =
  | { type: "Settings"; audio: AudioConfig; agent: AgentConfig }
  | { type: "UpdatePrompt"; prompt: string }
  | { type: "UpdateSpeak"; model: string }
  | { type: "KeepAlive" }
  | { type: "FunctionCallResponse"; id: string; name: string; content: string; description?: string; code?: string }
  | { type: "FunctionCallRequest"; functions: FunctionCallRequestConfig[] };

export const withBasePath = (path: string): string => {
  const basePath = nextConfig.basePath || "/";
  if (basePath === "/" || path === "/") return basePath === "/" ? path : basePath;

  return basePath + path;
};
