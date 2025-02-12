"use client";

import { useEffect, useRef, type RefObject, useState } from "react";

export function useScrollToBottom<T extends HTMLElement>(): [
  RefObject<T>,
  RefObject<T>,
  boolean,
  (value: boolean) => void
] {
  const containerRef = useRef<T>(null) as RefObject<T>;
  const endRef = useRef<T>(null) as RefObject<T>;
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    const end = endRef.current;

    if (container && end) {
      const observer = new MutationObserver(() => {
        if (shouldAutoScroll) {
          end.scrollIntoView({ behavior: "auto", block: "end" });
        }
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      return () => observer.disconnect();
    }
  }, [shouldAutoScroll]);

  return [containerRef, endRef, shouldAutoScroll, setShouldAutoScroll];
}