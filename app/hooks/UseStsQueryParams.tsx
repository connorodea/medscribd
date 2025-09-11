import { defaultVoice } from "app/lib/constants";
import type { StsConfig } from "app/utils/deepgramUtils";
import { useCallback, useState, useEffect } from "react";

export const useStsQueryParams = () => {
  const [params, setParams] = useState<{
    voice: string;
    instructions: string | null;
    provider: string | null;
    model: string | null;
    temp: string | null;
    tts_provider: string | null;
    keyterm: string[] | null;
  }>({
    voice: defaultVoice.canonical_name,
    instructions: null,
    provider: null,
    model: null,
    temp: null,
    tts_provider: null,
    keyterm: null,
  });

  // Notify other components when voice changes via custom event
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('voiceChanged', { 
      detail: { voice: params.voice } 
    }));
  }, [params]);

  const applyParamsToConfig = useCallback(
    (config: StsConfig) => {
      const { voice, instructions, provider, model, temp, tts_provider, keyterm } = params;
      return {
        ...config,
        agent: {
          ...config.agent,
          listen: {
            ...config.agent.listen,
            provider: {
              ...config.agent.listen.provider,
              ...(keyterm && keyterm.length > 0 && { keyterms: Array.isArray(keyterm) ? keyterm : [keyterm] }),
            },
          },
          think: {
            ...config.agent.think,
            provider: {
              ...config.agent.think.provider,
              ...(provider && { type: provider }),
              ...(model && { model: model }),
              ...(temp && { temperature: parseFloat(temp) }),
            },
            ...(instructions && {
              prompt: `${config.agent.think.prompt}\n${instructions}`,
            }),
          },
          speak: {
            ...config.agent.speak,
            provider: {
              ...config.agent.speak.provider,
              ...(voice && { model: voice }),
              ...(tts_provider && { type: tts_provider }),
              ...(temp && { temperature: parseFloat(temp) }),
            },
          },
        },
      };
    },
    [params],
  );

  const updateInstructionsUrlParam = useCallback(
    (text: string | null) => {
      setParams(prev => ({ ...prev, instructions: text }));
    },
    [],
  );

  const updateVoiceUrlParam = useCallback(
    (voice: string) => {
      if (params.voice === voice) {
        return; // No change needed
      }
      
      setParams(prev => {
        const newParams = { ...prev, voice };
        return newParams;
      });
    },
    [params],
  );


  
  return {
    ...params,
    applyParamsToConfig,
    updateInstructionsUrlParam,
    updateVoiceUrlParam,
  };
};
