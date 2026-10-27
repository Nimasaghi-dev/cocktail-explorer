import React, { useState, useEffect, useId, useRef } from 'react';
import './ScrollToTop.css';

const RING_LENGTH = 2 * Math.PI * 25; // ring radius 25 in the 56×56 viewBox

/**
 * Back-to-top button: a coupe glass that fills as you scroll down the page,
 * ringed by a scroll-progress circle. Gets a cherry when the page is done.
 */
const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const clipId = useId();
  const gradientId = useId();

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      // Written straight to the DOM so scrolling doesn't re-render React
      buttonRef.current?.style.setProperty('--p', progress.toFixed(4));
      setIsVisible(window.scrollY > 300);
      setIsFull(progress > 0.985);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Re-apply progress when the button mounts after becoming visible
  useEffect(() => {
    if (!isVisible) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    buttonRef.current?.style.setProperty('--p', progress.toFixed(4));
  }, [isVisible]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`scroll-to-top${isFull ? ' is-full' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <span className="scroll-to-top__label" aria-hidden="true">Back to top</span>
      <svg className="scroll-to-top__icon" viewBox="0 0 56 56" aria-hidden="true">
        <defs>
          <clipPath id={clipId}>
            <path d="M16.5 19 H39.5 Q38 31 28 32 Q18 31 16.5 19 Z" />
          </clipPath>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f3dea0" />
            <stop offset="100%" stopColor="#c49a45" />
          </linearGradient>
        </defs>

        <circle className="scroll-to-top__track" cx="28" cy="28" r="25" />
        <circle
          className="scroll-to-top__progress"
          cx="28"
          cy="28"
          r="25"
          style={{ strokeDasharray: RING_LENGTH } as React.CSSProperties}
        />

        <g className="scroll-to-top__glass">
          <g clipPath={`url(#${clipId})`}>
            <rect className="scroll-to-top__liquid" x="15" y="19" width="26" height="14" fill={`url(#${gradientId})`} />
          </g>
          <path className="scroll-to-top__outline" d="M16.5 19 H39.5 Q38 31 28 32 Q18 31 16.5 19 Z M28 32 V40 M22.5 41 H33.5" />
          <g className="scroll-to-top__cherry">
            <path d="M33 18 Q34 13 37 11" />
            <circle cx="32.5" cy="18" r="2.6" />
          </g>
        </g>
      </svg>
    </button>
  );
};

export default ScrollToTop;
