// HalloweenCard.tsx
// Dependencies: gsap, react
// Install: npm install gsap react react-dom
// For types: npm install -D @types/react @types/react-dom typescript

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from './HappyHalloweenCard.module.css';

// ─── Types ───────────────────────────────────────────────────────────────────

interface GhostProps { x: number; delay: number; scale: number; }
interface BatProps   { startX: number; startY: number; delay: number; }
interface PumpkinProps { x: number; size: number; delay: number; }
interface CandleProps  { x: number; delay: number; }
interface StarProps    { x: number; y: number; delay: number; size: number; }

// ─── Sub-components ──────────────────────────────────────────────────────────

const Ghost: React.FC<GhostProps> = ({ x, delay, scale }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const tl = gsap.timeline({ repeat: -1, delay });
    tl.to(ref.current, { y: -18, duration: 1.6, ease: "sine.inOut" })
      .to(ref.current, { y: 0,   duration: 1.6, ease: "sine.inOut" });
    gsap.to(ref.current, { rotation: 4, duration: 2.2, yoyo: true, repeat: -1, ease: "sine.inOut", delay });
    gsap.fromTo(ref.current, { opacity: 0, y: 40 }, { opacity: 0.9, y: 0, duration: 1.4, delay, ease: "power2.out" });
    return () => { tl.kill(); };
  }, [delay]);

  return (
    <svg
      ref={ref}
      viewBox="0 0 60 80"
      style={{ position: "absolute", bottom: "18%", left: `${x}%`, width: `${60 * scale}px`, opacity: 0 }}
    >
      {/* Body */}
      <path d="M5,40 Q5,5 30,5 Q55,5 55,40 L55,75 Q47,68 38,75 Q30,68 22,75 Q13,68 5,75 Z"
        fill="white" opacity="0.88" />
      {/* Eyes */}
      <ellipse cx="21" cy="36" rx="6" ry="7" fill="#5b2d8e" />
      <ellipse cx="39" cy="36" rx="6" ry="7" fill="#5b2d8e" />
      <circle cx="23" cy="34" r="2" fill="white" />
      <circle cx="41" cy="34" r="2" fill="white" />
      {/* Smile */}
      <path d="M20,50 Q30,60 40,50" stroke="#5b2d8e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
};

const Bat: React.FC<BatProps> = ({ startX, startY, delay }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const w = window.innerWidth;
    gsap.set(ref.current, { x: startX, y: startY, opacity: 0 });
    const tl = gsap.timeline({ repeat: -1, delay, repeatDelay: gsap.utils.random(1, 4) });
    tl.to(ref.current, { opacity: 1, duration: 0.3 })
      .to(ref.current, {
        x: w + 80, y: startY + gsap.utils.random(-80, 80),
        duration: gsap.utils.random(4, 7), ease: "none",
        modifiers: { y: (y) => `${parseFloat(y) + Math.sin(Date.now() / 300) * 18}px` },
      })
      .to(ref.current, { opacity: 0, duration: 0.3 }, "-=0.4")
      .set(ref.current, { x: -80, y: gsap.utils.random(50, 250) });

    // Wing flap
    const wings = ref.current.querySelectorAll(".wing");
    wings.forEach((w, i) => {
      gsap.to(w, { scaleY: 0.3, transformOrigin: "center bottom", duration: 0.18,
        yoyo: true, repeat: -1, ease: "power1.inOut", delay: i * 0.09 });
    });

    return () => { tl.kill(); };
  }, [startX, startY, delay]);

  return (
    <svg ref={ref} viewBox="0 0 80 40"       style={{ position: "fixed", width: "90px", zIndex: 20, top: 0, left: 0 }}>
      {/* Left wing */}
      <path className="wing" d="M38,20 Q20,0 0,10 Q15,20 38,24 Z" fill="#1a0533" />
      {/* Right wing */}
      <path className="wing" d="M42,20 Q60,0 80,10 Q65,20 42,24 Z" fill="#1a0533" />
      {/* Body */}
      <ellipse cx="40" cy="22" rx="8" ry="6" fill="#2d0d52" />
      {/* Ears */}
      <polygon points="35,17 32,10 38,16" fill="#2d0d52" />
      <polygon points="45,17 48,10 42,16" fill="#2d0d52" />
      {/* Eyes */}
      <circle cx="37" cy="21" r="2" fill="#ff9f00" />
      <circle cx="43" cy="21" r="2" fill="#ff9f00" />
    </svg>
  );
};

const Pumpkin: React.FC<PumpkinProps> = ({ x, size, delay }) => {
  const flameRef = useRef<SVGEllipseElement>(null);
  const glowRef  = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (!flameRef.current || !glowRef.current) return;
    gsap.to(flameRef.current, {
      scaleY: 0.6, scaleX: 1.3, transformOrigin: "center bottom",
      duration: 0.12, yoyo: true, repeat: -1, ease: "rough({ strength:2, points:10, randomize:true })", delay,
    });
    gsap.to(glowRef.current, {
      opacity: 0.25, r: size * 0.55, duration: 0.15,
      yoyo: true, repeat: -1, ease: "rough({ strength:3, points:8, randomize:true })", delay,
    });
  }, [delay, size]);

  const s = size;
  return (
    <svg viewBox={`0 0 ${s * 2} ${s * 2.2}`}
      style={{ position: "absolute", bottom: "8%", left: `${x}%`, width: `${s * 2}px` }}>
      {/* Glow */}
      <circle ref={glowRef} cx={s} cy={s * 1.1} r={s * 0.45} fill="#ff8c00" opacity="0.35" />
      {/* Stem */}
      <rect x={s - 4} y={2} width="8" height={s * 0.3} rx="3" fill="#3d7a1e" />
      {/* Body segments */}
      {[-0.35, -0.15, 0.05, 0.25].map((ox, i) => (
        <ellipse key={i} cx={s + ox * s} cy={s * 1.1} rx={s * 0.32} ry={s * 0.45} fill="#e85d04" />
      ))}
      {/* Face */}
      {/* Eyes */}
      <polygon points={`${s-18},${s*0.95} ${s-10},${s*0.85} ${s-2},${s*0.95}`} fill="#1a0533" />
      <polygon points={`${s+2},${s*0.95} ${s+10},${s*0.85} ${s+18},${s*0.95}`} fill="#1a0533" />
      {/* Nose */}
      <polygon points={`${s-4},${s*1.05} ${s+4},${s*1.05} ${s},${s*1.15}`} fill="#1a0533" />
      {/* Smile */}
      <path d={`M ${s-20} ${s*1.25} Q ${s} ${s*1.5} ${s+20} ${s*1.25}`}
        stroke="#1a0533" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Candle flame on top */}
      <ellipse ref={flameRef} cx={s} cy={s * 0.18} rx="5" ry="9" fill="#ffe066" opacity="0.95" />
      <ellipse cx={s} cy={s * 0.22} rx="3" ry="5" fill="#fff5a0" opacity="0.8" />
    </svg>
  );
};

const Candle: React.FC<CandleProps> = ({ x, delay }) => {
  const flameRef = useRef<SVGEllipseElement>(null);

  useEffect(() => {
    if (!flameRef.current) return;
    gsap.to(flameRef.current, {
      scaleY: 0.5, scaleX: 1.4, transformOrigin: "center bottom",
      duration: 0.1, yoyo: true, repeat: -1,
      ease: "rough({ strength:3, points:12, randomize:true })", delay,
    });
  }, [delay]);

  return (
    <svg viewBox="0 0 30 70" style={{ position: "absolute", bottom: "9%", left: `${x}%`, width: "28px" }}>
      <rect x="9" y="30" width="12" height="35" rx="3" fill="#e8c46a" />
      <rect x="11" y="32" width="3" height="20" rx="1" fill="#f5d98f" opacity="0.5" />
      {/* Wick */}
      <line x1="15" y1="30" x2="15" y2="22" stroke="#333" strokeWidth="1.5" />
      {/* Flame */}
      <ellipse ref={flameRef} cx="15" cy="16" rx="5" ry="9" fill="#ffe066" />
      <ellipse cx="15" cy="18" rx="3" ry="5" fill="#fff5a0" opacity="0.8" />
      {/* Drips */}
      <path d="M9,38 Q7,44 9,48" stroke="#e8c46a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
};

const Star: React.FC<StarProps> = ({ x, y, delay, size }) => {
  const ref = useRef<SVGCircleElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, { opacity: 0.1, duration: gsap.utils.random(0.8, 2.4),
      yoyo: true, repeat: -1, ease: "sine.inOut", delay });
  }, [delay]);
  return (
    <circle ref={ref} cx={`${x}%`} cy={`${y}%`} r={size} fill="white" opacity="0.9"
      style={{ position: "absolute" } as React.CSSProperties} />
  );
};

// ─── Lightning ────────────────────────────────────────────────────────────────

const useLightning = (overlayRef: React.RefObject<HTMLDivElement>) => {
  useEffect(() => {
    if (!overlayRef.current) return;
    const flash = () => {
      if (!overlayRef.current) return;
      const tl = gsap.timeline();
      tl.to(overlayRef.current, { opacity: 0.55, duration: 0.05 })
        .to(overlayRef.current, { opacity: 0,    duration: 0.07 })
        .to(overlayRef.current, { opacity: 0.3,  duration: 0.04 })
        .to(overlayRef.current, { opacity: 0,    duration: 0.12 });
      const next = gsap.utils.random(4000, 10000);
      setTimeout(flash, next);
    };
    const t = setTimeout(flash, 3000);
    return () => clearTimeout(t);
  }, [overlayRef]);
};

// ─── Title Animation ──────────────────────────────────────────────────────────

const useTitle = (ref: React.RefObject<HTMLHeadingElement>) => {
  useEffect(() => {
    if (!ref.current) return;
    const chars = ref.current.querySelectorAll("span");
    gsap.fromTo(chars,
      { y: -60, opacity: 0, rotation: gsap.utils.wrap([-12, 12]) },
      { y: 0, opacity: 1, rotation: 0, duration: 0.7, stagger: 0.06,
        ease: "back.out(1.8)", delay: 0.4 });
    gsap.to(chars, { color: "#ffe066", duration: 1.2, yoyo: true, repeat: -1,
      stagger: { each: 0.1, repeat: -1, yoyo: true }, ease: "sine.inOut", delay: 1.5 });
  }, [ref]);
};

// ─── Main Component ───────────────────────────────────────────────────────────

const HalloweenCard: React.FC = () => {

    function resetTimeline() {


        // Kill all active GSAP tweens on tracked elements
    if (masterTlRef.current) masterTlRef.current.kill();
    gsap.killTweensOf(titleRef.current?.querySelectorAll("span") ?? []);
    gsap.killTweensOf(moonRef.current);

    // Reset title letters
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll("span");
      gsap.set(chars, { y: -60, opacity: 0, rotation: 0, color: "#ff6b00" });
    }

    // Reset moon
    if (moonRef.current) gsap.set(moonRef.current, { y: 0 });

    // Re-run title animation
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll("span");
      const tl = gsap.timeline();
      masterTlRef.current = tl;
      tl.to(chars, {
        y: 0, opacity: 1, rotation: 0, duration: 0.7,
        stagger: 0.06, ease: "back.out(1.8)", delay: 0.4,
      }).to(chars, {
        color: "#ffe066", duration: 1.2, yoyo: true, repeat: -1,
        stagger: { each: 0.1, repeat: -1, yoyo: true },
        ease: "sine.inOut", delay: 0,
      });
    }

    // Re-run moon animation
    if (moonRef.current) {
      gsap.to(moonRef.current, { y: -10, duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut" });
    }

    };

  const lightningRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const titleRef     = useRef<HTMLHeadingElement>(null) as React.RefObject<HTMLHeadingElement>;
  const moonRef      = useRef<SVGSVGElement>(null) as React.RefObject<SVGSVGElement>;
  const masterTlRef  = useRef<gsap.core.Timeline | null>(null) as React.MutableRefObject<gsap.core.Timeline | null>;

  useLightning(lightningRef);
  useTitle(titleRef);

  useEffect(() => {
    if (!moonRef.current) return;
    gsap.to(moonRef.current, { y: -10, duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut" });
  }, []);

  const lines = ["Happy", "Halloween!"];

  const ghosts   = [
    { x: 8,  delay: 0,   scale: 1.1 },
    { x: 72, delay: 0.9, scale: 0.85 },
    { x: 44, delay: 1.7, scale: 0.7 },
  ];
  const bats = [
    { startX: -80, startY: 80,  delay: 0.5 },
    { startX: -80, startY: 160, delay: 2.2 },
    { startX: -80, startY: 50,  delay: 4.1 },
    { startX: -80, startY: 220, delay: 6.0 },
  ];
  const pumpkins = [
    { x: 2,  size: 38, delay: 0 },
    { x: 20, size: 28, delay: 0.3 },
    { x: 60, size: 42, delay: 0.6 },
    { x: 80, size: 30, delay: 0.2 },
  ];
  const candles = [
    { x: 13, delay: 0.1 },
    { x: 32, delay: 0.5 },
    { x: 50, delay: 0.8 },
    { x: 88, delay: 0.3 },
  ];
  const stars = Array.from({ length: 30 }, (_, i) => ({
    i: i,
    x: Math.random() * 100, y: Math.random() * 55,
    delay: Math.random() * 3, size: Math.random() * 1.8 + 0.5,
  }));

  const [isFullscreen, setIsFullscreen] = useState(true);
  
     function toggleFullscreen() {
  
      const maiConDiv = document.getElementById('maiConDiv') as HTMLDivElement;
  
      if (isFullscreen === true) {
  
          maiConDiv.style.position = 'relative';
          maiConDiv.style.zIndex = '9';
  
  
  
          setIsFullscreen(false);
  
      } else {
  
          maiConDiv.style.position = 'fixed';
          maiConDiv.style.width = '100vw';
          maiConDiv.style.height = '100vh';
          maiConDiv.style.zIndex = '999';
  
  
  
          setIsFullscreen(true);
  
      }
  
    }

  return (
    <div id='maiConDiv' style={{
      position: "fixed", top: 0, left: 0, zIndex: 999, width: "100vw", height: "100vh", overflow: "hidden",
      background: "linear-gradient(to bottom, #0a0015 0%, #1a0533 45%, #2d0d52 70%, #1a0a00 100%)",
      fontFamily: "'Segoe UI', sans-serif",
    }}>

      {/* Stars */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        {stars.map((s, i) => <Star key={i} {...s} />)}
      </svg>

      {/* Moon */}
      <svg ref={moonRef} viewBox="0 0 120 120"
        style={{ position: "absolute", top: "4%", right: "8%", width: "110px", opacity: 0.95 }}>
        <defs>
          <radialGradient id="moonGrad" cx="40%" cy="40%">
            <stop offset="0%" stopColor="#fff9c4" />
            <stop offset="100%" stopColor="#f0c040" />
          </radialGradient>
          <filter id="moonGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <circle cx="60" cy="60" r="44" fill="#f0c040" opacity="0.18" filter="url(#moonGlow)" />
        <circle cx="60" cy="60" r="38" fill="url(#moonGrad)" />
        {/* Craters */}
        <circle cx="48" cy="50" r="6" fill="#e6b820" opacity="0.5" />
        <circle cx="70" cy="70" r="4" fill="#e6b820" opacity="0.4" />
        <circle cx="74" cy="44" r="3" fill="#e6b820" opacity="0.35" />
      </svg>

      {/* Bats */}
      {bats.map((b, i) => <Bat key={i} {...b} />)}

      {/* Ghosts */}
      {ghosts.map((g, i) => <Ghost key={i} {...g} />)}

      {/* Title */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center", zIndex: 10,
      }}>
        <h1 className={ styles.butchermanFont } ref={titleRef} style={{
          fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 900, letterSpacing: "0.04em",
          color: "#ff6b00", textShadow: "0 0 30px #ff6b00aa, 0 4px 0 #1a0533",
          margin: 0, lineHeight: 1.2,
        }}>
          {lines.map((line, li) => (
            <div key={li} style={{ display: "block" }}>
              {line.split("").map((ch, i) => (
                <span key={`${li}-${i}`} style={{ display: "inline-block", opacity: 0 }}>
                  {ch}
                </span>
              ))}
            </div>
          ))}
        </h1>
        <p className={ styles.barriecitoFont } style={{
          color: "#ffe066", fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
          marginTop: "1rem", opacity: 0.85, letterSpacing: "0.12em",
          textShadow: "0 0 12px #ff8c00",
        }}>
          👻 Wishing you a frightfully fun night! 🎃
        </p>
      </div>

      {/* Ground layer */}
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none"
        style={{ position: "absolute", bottom: 0, width: "100%", height: "13%" }}>
        <path d="M0,60 Q200,20 400,55 Q600,90 800,50 Q1000,10 1200,55 Q1350,80 1440,50 L1440,120 L0,120 Z"
          fill="#0f0020" />
      </svg>

      {/* Pumpkins */}
      {pumpkins.map((p, i) => <Pumpkin key={i} {...p} />)}

      {/* Candles */}
      {candles.map((c, i) => <Candle key={i} {...c} />)}

      {/* Lightning overlay */}
      <div ref={lightningRef} style={{
        position: "fixed", inset: 0, background: "#c8d8ff",
        opacity: 0, pointerEvents: "none", zIndex: 30,
      }} />

      <div id='butConDiv' className={ styles.buttonContainerDiv } >


            <button id='repAniBut' className={ styles.animationButtons } onClick={resetTimeline} >
                Replay
            </button>



            <button id='fulScrBut' className={ styles.animationButtons } onClick={() => toggleFullscreen()} >
                Toggle Fullscreen
            </button>

        </div>

    </div>
  );
};

export default HalloweenCard;