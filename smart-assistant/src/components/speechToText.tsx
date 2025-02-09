import { useState, useRef } from "react";
import { PlayCircle, PauseCircle, StopCircle } from "iconsax-react";

const SpeechSynthesisWidget = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handlePlayPauseResume = () => {
    if (isPlaying && !isPaused) {
      // Pause the speech
      synthRef.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
    } else if (isPaused) {
      // Resume the speech
      synthRef.current.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      // Start the speech
      utteranceRef.current = new SpeechSynthesisUtterance(text);
      utteranceRef.current.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };
      synthRef.current.speak(utteranceRef.current);
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  return (
    <div className="flex justify-end mt-2">
      <button
        className="rounded-sm text-white flex items-center"
        onClick={handlePlayPauseResume}
        disabled={!text}
      >
        {isPlaying ? (
          isPaused ? (
            <PlayCircle size="18" color="purple" />
          ) : (
            <PauseCircle size="18" color="purple" />
          )
        ) : (
          <PlayCircle size="18" color="purple" />
        )}
      </button>
      <button
        className="mx-4 my-2 rounded-sm flex items-center"
        onClick={handleStop}
        disabled={!isPlaying && !synthRef.current.speaking}
      >
        <StopCircle size="18" color="red" />
      </button>
    </div>
  );
};

export default SpeechSynthesisWidget;
