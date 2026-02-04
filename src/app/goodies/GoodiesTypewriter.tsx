"use client";

import { useEffect, useRef, useState } from "react";

export default function GoodiesTypewriter({ text }: { text: string }) {
  const [renderedText, setRenderedText] = useState("");
  const timeoutRef = useRef<number | null>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    const step = () => {
      indexRef.current = Math.min(text.length, indexRef.current + 1);
      setRenderedText(text.substring(0, indexRef.current));

      if (indexRef.current < text.length) {
        timeoutRef.current = window.setTimeout(step, 60);
      }
    };

    step();
    return () => {
      if (timeoutRef.current != null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [text]);

  return (
    <div className="goodies-typewriter">
      <span className="typewriter-text">{renderedText}</span>
      <span className="typewriter-cursor" />
    </div>
  );
}
