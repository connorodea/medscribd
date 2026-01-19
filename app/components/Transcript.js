import React, { useMemo } from "react";
import { useVoiceBot } from "../context/VoiceBotContextProvider";

function Transcript() {
  const { messages } = useVoiceBot();

  const lastMessage = [...messages].reverse().find((message) => message?.user || message?.assistant);
  const text = lastMessage?.user || lastMessage?.assistant || "";
  const words = useMemo(() => text.trim().split(/\s+/).filter(Boolean), [text]);
  const activeIndex = Math.max(words.length - 1, 0);

  return (
    <div className="flex items-center justify-center">
      {words.length > 0 && (
        <div className="text-center leading-relaxed">
          {words.map((word, index) => (
            <span
              key={`${word}-${index}`}
              className={`transcript-word ${index === activeIndex ? "active" : ""}`}
            >
              {word}
              {index < words.length - 1 ? " " : ""}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default Transcript;
