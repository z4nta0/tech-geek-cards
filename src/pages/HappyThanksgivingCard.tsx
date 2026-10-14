import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from './HappyThanksgivingCard.module.css';

// ── Types ─────────────────────────────────────────────────────────────────────
interface LeafConfig {
  id: number;
  x: number;
  size: number;
  color: string;
  rotation: number;
  delay: number;
  duration: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const LEAF_COLORS: string[] = [
  "#D2691E", "#CD853F", "#A0522D", "#B8860B",
  "#DAA520", "#8B4513", "#FF8C00", "#E2703A",
];

const LEAF_COUNT = 30;

function generateLeaves(): LeafConfig[] {
  return Array.from({ length: LEAF_COUNT }, (_, i) => {
    // Divide screen into thirds; ensure each third gets coverage
    const third = i % 3;
    const xBase = third * 33.33;
    const x = xBase + Math.random() * 33.33;
    return {
      id: i,
      x,
      size: 14 + Math.random() * 22,
      color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
      rotation: Math.random() * 360,
      delay: Math.random() * 6,
      duration: 6 + Math.random() * 6,
    };
  });
}

const LEAVES = generateLeaves();

// ── Leaf SVG ──────────────────────────────────────────────────────────────────
function Leaf({ config }: { config: LeafConfig }) {
  return (
    <svg
      className={`leaf leaf-${config.id}`}
      width={config.size}
      height={config.size}
      viewBox="0 0 40 40"
      style={{
        position: "absolute",
        left: `${config.x}%`,
        top: "-60px",
        opacity: 0,
        transform: `rotate(${config.rotation}deg)`,
        pointerEvents: "none",
      }}
    >
      <path
        d="M20 2 C10 2 2 10 2 20 C2 30 10 38 20 38 C20 38 20 20 20 2Z"
        fill={config.color}
        opacity="0.9"
      />
      <path
        d="M20 2 C30 2 38 10 38 20 C38 30 30 38 20 38 C20 38 20 20 20 2Z"
        fill={config.color}
        opacity="0.75"
      />
      <line x1="20" y1="2" x2="20" y2="38" stroke="#5C3317" strokeWidth="1.2" opacity="0.5" />
      <line x1="20" y1="12" x2="10" y2="22" stroke="#5C3317" strokeWidth="0.8" opacity="0.4" />
      <line x1="20" y1="18" x2="30" y2="26" stroke="#5C3317" strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

// ── Turkey SVG ────────────────────────────────────────────────────────────────
function Turkey() {
  return (
    <svg
      id="turkey"
      viewBox="0 0 200 220"
      width="200"
      height="220"
      style={{ overflow: "visible", opacity: 0 }}
    >
      {/* Tail feathers */}
      {[
        { cx: 100, cy: 130, rx: 18, ry: 55, rot: -40, color: "#8B0000" },
        { cx: 100, cy: 130, rx: 18, ry: 55, rot: -20, color: "#DAA520" },
        { cx: 100, cy: 130, rx: 18, ry: 55, rot: 0,   color: "#D2691E" },
        { cx: 100, cy: 130, rx: 18, ry: 55, rot: 20,  color: "#DAA520" },
        { cx: 100, cy: 130, rx: 18, ry: 55, rot: 40,  color: "#8B0000" },
      ].map((f, i) => (
        <ellipse
          key={i}
          id={`feather-${i}`}
          cx={f.cx}
          cy={f.cy}
          rx={f.rx}
          ry={f.ry}
          fill={f.color}
          opacity="0.9"
          transform={`rotate(${f.rot}, 100, 160)`}
        />
      ))}
      {/* Body */}
      <ellipse cx="100" cy="155" rx="42" ry="38" fill="#8B4513" />
      {/* Wing */}
      <ellipse cx="78" cy="158" rx="20" ry="28" fill="#A0522D" transform="rotate(-15,78,158)" />
      {/* Neck */}
      <ellipse cx="100" cy="118" rx="16" ry="22" fill="#8B4513" />
      {/* Head */}
      <circle cx="100" cy="98" r="20" fill="#CD853F" />
      {/* Eye */}
      <circle cx="107" cy="93" r="4" fill="#1a1a1a" />
      <circle cx="108.5" cy="91.5" r="1.2" fill="white" />
      {/* Beak */}
      <polygon points="114,98 124,96 114,102" fill="#DAA520" />
      {/* Wattle */}
      <ellipse cx="112" cy="104" rx="5" ry="8" fill="#CC2200" />
      {/* Feet */}
      <line x1="88" y1="192" x2="82" y2="210" stroke="#DAA520" strokeWidth="3" strokeLinecap="round" />
      <line x1="82" y1="210" x2="72" y2="214" stroke="#DAA520" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="82" y1="210" x2="80" y2="218" stroke="#DAA520" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="112" y1="192" x2="118" y2="210" stroke="#DAA520" strokeWidth="3" strokeLinecap="round" />
      <line x1="118" y1="210" x2="128" y2="214" stroke="#DAA520" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="118" y1="210" x2="120" y2="218" stroke="#DAA520" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Horn of Plenty SVG ────────────────────────────────────────────────────────
function Cornucopia() {
  return (
    <svg
      id="cornucopia"
      viewBox="0 0 260 200"
      width="260"
      height="200"
      style={{ overflow: "visible", opacity: 0 }}
    >
      {/* Horn body */}
      <path
        d="M30 100 Q60 60 130 80 Q180 90 230 70 Q240 68 245 72 Q250 76 245 82 Q220 100 170 105 Q110 112 60 140 Z"
        fill="#C8882A"
        stroke="#8B5E1A"
        strokeWidth="2"
      />
      {/* Horn shading */}
      <path
        d="M30 100 Q60 75 130 88 Q180 97 230 76"
        fill="none"
        stroke="#DAA520"
        strokeWidth="3"
        opacity="0.5"
      />
      {/* Pumpkin */}
      <ellipse id="produce-0" cx="52" cy="88" rx="22" ry="18" fill="#E2703A" />
      <ellipse cx="52" cy="88" rx="14" ry="18" fill="#D2601A" opacity="0.3" />
      <rect x="50" y="70" width="4" height="8" rx="2" fill="#5C3317" />
      <path d="M54 73 Q62 68 60 76" fill="none" stroke="#5C3317" strokeWidth="1.5" />
      {/* Apple */}
      <circle id="produce-1" cx="82" cy="76" r="14" fill="#CC2200" />
      <rect x="80" y="62" width="3" height="7" rx="1.5" fill="#5C3317" />
      {/* Grapes */}
      {[
        [26, 80], [34, 74], [42, 72], [30, 70], [38, 66],
      ].map(([gx, gy], i) => (
        <circle key={i} id={`produce-${i + 2}`} cx={gx} cy={gy} r="7" fill="#6B2FA0" opacity="0.85" />
      ))}
      {/* Corn */}
      <ellipse id="produce-7" cx="70" cy="62" rx="9" ry="20" fill="#DAA520" transform="rotate(-30,70,62)" />
      <line x1="62" y1="50" x2="78" y2="74" stroke="#B8860B" strokeWidth="1" opacity="0.6" />
      {/* Leaf accents */}
      <ellipse cx="20" cy="95" rx="12" ry="6" fill="#5A7A2A" transform="rotate(20,20,95)" opacity="0.8" />
      <ellipse cx="48" cy="58" rx="10" ry="5" fill="#5A7A2A" transform="rotate(-15,48,58)" opacity="0.8" />
    </svg>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ThanksgivingCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leavesRef = useRef<HTMLDivElement>(null);


  const [ resetBoolean, setResetBoolean ] = useState(false);

    function resetTimeline() {


        setResetBoolean(true);

        setTimeout(() => {
            setResetBoolean(false);
        }, 100);

    };



  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // 1. Cornucopia entrance
      tl.to("#cornucopia", { opacity: 1, x: 0, duration: 0.8, ease: "back.out(1.4)" }, 0)
        .from("#cornucopia", { x: -80 }, 0);

      // Produce pop-in
      for (let i = 0; i < 8; i++) {
        tl.from(`#produce-${i}`, {
          scale: 0, transformOrigin: "center",
          duration: 0.3, ease: "back.out(2)",
        }, 0.5 + i * 0.07);
      }

      // 2. Turkey entrance
      tl.to("#turkey", { opacity: 1, duration: 0.6, ease: "power2.out" }, 0.8)
        .from("#turkey", { y: 40 }, 0.8);

      // Feather fan
      for (let i = 0; i < 5; i++) {
        tl.from(`#feather-${i}`, {
          scaleY: 0, transformOrigin: "bottom center",
          duration: 0.45, ease: "back.out(1.7)",
        }, 0.9 + i * 0.08);
      }

      // Turkey idle wobble
      tl.add(() => {
        gsap.to("#turkey", {
          rotation: 3, transformOrigin: "bottom center",
          duration: 0.9, yoyo: true, repeat: -1, ease: "sine.inOut",
        });
      }, 1.8);

      // 3. Text reveal
      tl.to("#title-text", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 1.4)
        .from("#title-text", { y: 30 }, 1.4)
        .to("#msg-text", { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, 2.0)
        .from("#msg-text", { y: 20 }, 2.0);

      // 4. Continuous falling leaves
      LEAVES.forEach((leaf) => {
        const el = document.querySelector(`.leaf-${leaf.id}`);
        if (!el) return;

        const animateLeaf = () => {
          const startX = Math.random() * window.innerWidth;
          const drift  = (Math.random() - 0.5) * 200;
          gsap.set(el, { x: startX, y: -60, opacity: 0, rotation: Math.random() * 360 });
          gsap.to(el, {
            y: window.innerHeight + 80,
            x: `+=${drift}`,
            opacity: 1,
            rotation: `+=${(Math.random() - 0.5) * 540}`,
            duration: leaf.duration,
            delay: leaf.delay,
            ease: "none",
            onComplete: animateLeaf,
          });
        };

        gsap.delayedCall(leaf.delay, animateLeaf);
      });
    }, containerRef);

    return () => ctx.revert();
  }, [resetBoolean]);

  const [isFullscreen, setIsFullscreen] = useState(true);
    
      function toggleFullscreen() {
  
          const maiConDiv = document.getElementById('maiConDiv') as HTMLDivElement;
  
          if (isFullscreen === true) {
  
              maiConDiv.style.overflow = 'auto';
              maiConDiv.style.position = 'relative';
              maiConDiv.style.width = '100%';
              maiConDiv.style.paddingTop = '72px';
              maiConDiv.style.zIndex = '9';
  
              document.body.style.overflow = 'auto';
  
  
  
              setIsFullscreen(false);
  
          } else {
  
              maiConDiv.style.overflow = 'hidden';
              maiConDiv.style.position = 'fixed';
              maiConDiv.style.width = '100vw';
              maiConDiv.style.paddingTop = '0';
              maiConDiv.style.zIndex = '999';
  
              document.body.style.overflow = 'hidden';
  
  
  
              setIsFullscreen(true);
  
          }
  
      };

  return (
    <div
      id='maiConDiv'
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 999,
        width: "100vw",
        minHeight: "100vh",
        background: "linear-gradient(160deg, #3B1F0A 0%, #7B3A10 35%, #C4621D 70%, #E8A040 100%)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Georgia', serif",
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 60%, rgba(255,160,40,0.18) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Falling leaves layer */}
      <div ref={leavesRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 10 }}>
        {LEAVES.map((leaf) => <Leaf key={leaf.id} config={leaf} />)}
      </div>

      {/* Card content */}
      <div style={{
        position: "relative", zIndex: 5,
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: "2rem", padding: "2rem",
        maxWidth: "800px", width: "100%",
      }}>
        {/* Title */}
        <h1
          id="title-text"
          className={ styles.peraltaFont }
          style={{
            opacity: 0,
            color: "#FFF3CC",
            fontSize: "clamp(2.4rem, 7vw, 5rem)",
            fontWeight: "bold",
            letterSpacing: "0.04em",
            textAlign: "center",
            margin: 0,
            textShadow: "0 4px 24px rgba(120,50,0,0.7), 0 1px 0 #8B4513",
            lineHeight: 1.15,
          }}
        >
          Happy Thanksgiving
        </h1>

        {/* Illustrations row */}
        <div style={{
          display: "flex", alignItems: "flex-end",
          justifyContent: "center", gap: "2.5rem",
          flexWrap: "wrap",
        }}>
          <Cornucopia />
          <Turkey />
        </div>

        {/* Message */}
        <p
          id="msg-text"
          className={ styles.cookieFont }
          style={{
            opacity: 0,
            color: "#FDECC8",
            fontSize: "clamp(1rem, 2.5vw, 1.35rem)",
            textAlign: "center",
            maxWidth: "560px",
            lineHeight: 1.75,
            margin: 0,
            textShadow: "0 2px 12px rgba(80,30,0,0.5)",
            fontStyle: "italic",
          }}
        >
          May your table overflow with warmth, your heart with gratitude,
          and your days with the joy of those you hold dear.
          <br /><br />
          <span style={{ fontStyle: "normal", fontSize: "0.85em", opacity: 0.8 }}>
            🍂 Wishing you a beautiful Thanksgiving 🍂
          </span>
        </p>
      </div>

      <div id='butConDiv' className={ styles.buttonContainerDiv } >


            <button id='repAniBut' className={ styles.animationButtons } onClick={() => resetTimeline()} >
                Replay
            </button>



            <button id='fulScrBut' className={ styles.animationButtons } onClick={() => toggleFullscreen()} >
                Toggle Fullscreen
            </button>

        </div>
    </div>
  );
}