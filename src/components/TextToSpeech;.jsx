import React, { useState, useEffect } from "react";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Helper function to wait for voices to load
  const waitForVoices = () => {
    return new Promise((resolve) => {
      const checkVoices = () => {
        const available = window.speechSynthesis.getVoices();
        if (available.length > 0) {
          resolve(available);
        } else {
          setTimeout(checkVoices, 100);
        }
      };
      checkVoices();
    });
  };

  const speakText = async () => {
    if (!text.trim()) return;
    setIsSpeaking(true);

    // Ensure voices are loaded
    if (voices.length === 0) {
      const availableVoices = await waitForVoices();
      setVoices(availableVoices);
    }

    const sentences = text.split("\n"); // Split text by new lines for Q&A

    for (let sentence of sentences) {
      if (!isSpeaking) break; // If stopped, exit the loop
      const parts = sentence.split("|");
      const question = parts[0]?.trim() || "";
      const delayTime = parseInt(parts[1]) || 0;
      const answer = parts[2]?.trim() || "";

      if (question) {
        await speakSentence(question);
      }
      if (delayTime > 0) {
        await new Promise((res) => setTimeout(res, delayTime * 1000));
      }
      if (answer) {
        await speakSentence(answer);
      }
    }
    setIsSpeaking(false);
  };

  const speakSentence = (sentence) => {
    return new Promise((resolve) => {
      const availableVoices = window.speechSynthesis.getVoices();
      const chosenVoice =
        availableVoices.find((voice) => voice.name.includes("Google")) ||
        availableVoices[0];
      if (!chosenVoice) {
        console.warn("No voices available");
        resolve();
        return;
      }
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.voice = chosenVoice;
      utterance.onend = resolve;
      window.speechSynthesis.speak(utterance);
    });
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto border rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-2">Text-to-Speech (With Delay)</h2>
      <textarea
        className="w-full p-2 border rounded-md"
        rows="6"
        placeholder={`Enter text in format:\nQuestion | Delay (seconds) | Answer\nExample: What is 2+2? | 3 | 4`}
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <div className="mt-3 flex gap-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400"
          onClick={speakText}
          disabled={isSpeaking}
        >
          {isSpeaking ? "Speaking..." : "Start"}
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-md"
          onClick={stopSpeaking}
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default TextToSpeech;
