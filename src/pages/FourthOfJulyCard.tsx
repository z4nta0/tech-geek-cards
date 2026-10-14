import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from './FourthOfJulyCard.module.css';

interface Firework {
  id: number;
  x: number;
  y: number;
  color: string;
  particles: Particle[];
}

interface Particle {
  id: number;
  angle: number;
  distance: number;
  color: string;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

const COLORS = ["#FF4444", "#FFFFFF", "#4488FF", "#FFD700", "#FF6B6B", "#88CCFF"];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: (360 / count) * i + randomBetween(-10, 10),
    distance: randomBetween(60, 130),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));
}

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: randomBetween(0, 100),
    y: randomBetween(0, 60),
    size: randomBetween(1, 3),
    opacity: randomBetween(0.4, 1),
  }));
}

export default function FourthOfJulyCard() {

    const [ resetBoolean, setResetBoolean ] = useState(false);

    function resetTimeline() {


        setResetBoolean(true);

        setTimeout(() => {
            setResetBoolean(false);
        }, 100);

    };



  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const [stars] = useState<Star[]>(() => generateStars(80));
  const headlineRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const flagRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement[]>([]);
  const fireworkIdRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Entrance animations
  useEffect(() => {
    gsap.fromTo(cardRef.current, { opacity: 0 }, { opacity: 1, duration: 1 });

    gsap.fromTo(
      headlineRef.current,
      { y: -60, opacity: 0, scale: 0.7 },
      { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "back.out(1.7)", delay: 0.4 }
    );

    gsap.fromTo(
      subRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 1.2 }
    );

    gsap.fromTo(
      flagRef.current,
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.8 }
    );

    starsRef.current.forEach((el) => {
      if (!el) return;
      gsap.to(el, {
        opacity: randomBetween(0.1, 0.9),
        duration: randomBetween(0.8, 2.5),
        repeat: -1,
        yoyo: true,
        delay: randomBetween(0, 2),
        ease: "sine.inOut",
      });
    });
  }, [resetBoolean]);

  // Fireworks launcher
  useEffect(() => {
    const launch = () => {
      const id = fireworkIdRef.current++;
      const fw: Firework = {
        id,
        x: randomBetween(15, 85),
        y: randomBetween(10, 55),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        particles: generateParticles(14),
      };
      setFireworks(prev => [...prev, fw]);
      setTimeout(() => setFireworks(prev => prev.filter(f => f.id !== id)), 1800);
    };

    launch();
    intervalRef.current = setInterval(launch, 900);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [resetBoolean]);

  // Animate each new firework burst
  useEffect(() => {
    if (fireworks.length === 0) return;
    const fw = fireworks[fireworks.length - 1];
    const container = document.getElementById(`fw-${fw.id}`);
    if (!container) return;

    const shell = container.querySelector(".shell");
    const burst = container.querySelector(".burst");
    const particles = container.querySelectorAll(".particle");

    gsap.fromTo(shell, { opacity: 1 }, { opacity: 0, duration: 0.3, ease: "power1.in" });

    gsap.fromTo(
      burst,
      { scale: 0, opacity: 1 },
      { scale: 1, opacity: 0, duration: 0.5, delay: 0.2, ease: "power2.out" }
    );

    particles.forEach((p, i) => {
      const angle = fw.particles[i]?.angle ?? 0;
      const dist = fw.particles[i]?.distance ?? 80;
      const rad = (angle * Math.PI) / 180;
      gsap.fromTo(
        p,
        { x: 0, y: 0, opacity: 1, scale: 1 },
        {
          x: Math.cos(rad) * dist,
          y: Math.sin(rad) * dist,
          opacity: 0,
          scale: 0.3,
          duration: randomBetween(0.9, 1.5),
          delay: 0.25,
          ease: "power2.out",
        }
      );
    });
  }, [fireworks]);

  const [isFullscreen, setIsFullscreen] = useState(true);

   function toggleFullscreen() {

    const maiConDiv = document.getElementById('maiConDiv') as HTMLDivElement;

    if (isFullscreen === true) {

        maiConDiv.style.position = 'relative';
        maiConDiv.style.width = '100%';
        maiConDiv.style.height = '100%';
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
    <div
      id='maiConDiv'
      ref={cardRef}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0a0a2e 0%, #0d1b4b 50%, #1a0a0a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Georgia', serif",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 999,
        opacity: 0,
      }}
    >
      {/* Stars */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {stars.map((s, i) => (
          <div
            key={s.id}
            ref={el => { if (el) starsRef.current[i] = el; }}
            style={{
              position: "absolute",
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: "#fff",
              opacity: s.opacity,
            }}
          />
        ))}
      </div>

      {/* Fireworks */}
      {fireworks.map(fw => (
        <div
          key={fw.id}
          id={`fw-${fw.id}`}
          style={{
            position: "absolute",
            left: `${fw.x}%`,
            top: `${fw.y}%`,
            pointerEvents: "none",
          }}
        >
          <div
            className="shell"
            style={{
              width: 4,
              height: 18,
              background: fw.color,
              borderRadius: 2,
              position: "absolute",
              left: -2,
              top: 0,
              boxShadow: `0 0 6px ${fw.color}`,
            }}
          />
          <div
            className="burst"
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              border: `3px solid ${fw.color}`,
              position: "absolute",
              left: -30,
              top: -30,
              boxShadow: `0 0 12px ${fw.color}`,
            }}
          />
          {fw.particles.map(p => (
            <div
              key={p.id}
              className="particle"
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: p.color,
                position: "absolute",
                left: -2.5,
                top: -2.5,
                boxShadow: `0 0 6px ${p.color}`,
              }}
            />
          ))}
        </div>
      ))}

      {/* Card Content */}
      <div style={{ textAlign: "center", zIndex: 10, padding: "2rem", maxWidth: 560 }}>
        {/* Flag */}
        <div
          ref={flagRef}
          style={{
            display: "inline-block",
            marginBottom: "1.5rem",
            border: "2px solid rgba(255,255,255,0.3)",
            borderRadius: 6,
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
            width: 180,
            height: 95,
            position: "relative",
          }}
        >
          {[...Array(13)].map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: `${(i / 13) * 100}%`,
                height: `${100 / 13}%`,
                background: i % 2 === 0 ? "#B22234" : "#FFFFFF",
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "40%",
              height: `${(7 / 13) * 100}%`,
              background: "#3C3B6E",
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gridTemplateRows: "repeat(5, 1fr)",
              alignItems: "center",
              justifyItems: "center",
              padding: "3px",
              boxSizing: "border-box",
            }}
          >
            {[...Array(50)].map((_, i) => (
              <span key={i} style={{ color: "#FFFFFF", fontSize: "6px", lineHeight: 1 }}>★</span>
            ))}
          </div>
        </div>

        {/* Headline */}
        <div
          ref={headlineRef}
          style={{
            fontSize: "clamp(2rem, 7vw, 3.8rem)",
            fontWeight: "bold",
            color: "#FFFFFF",
            textShadow: "0 0 30px rgba(255,100,100,0.8), 0 0 60px rgba(100,150,255,0.6)",
            lineHeight: 1.1,
            marginBottom: "1rem",
            letterSpacing: "0.02em",
          }}
        >
          🎆 Happy 4th of July! 🎆
        </div>

        <div style={{ color: "#FFD700", fontSize: "1.4rem", marginBottom: "1rem", letterSpacing: 8 }}>
          ★ ★ ★ ★ ★
        </div>

        <div
          ref={subRef}
          style={{
            color: "rgba(200, 220, 255, 0.95)",
            fontSize: "clamp(1rem, 3vw, 1.3rem)",
            lineHeight: 1.7,
            maxWidth: 400,
            margin: "0 auto",
            textShadow: "0 1px 8px rgba(0,0,0,0.8)",
          }}
        >
          Wishing you a day filled with freedom, joy, and the warmth of good company.
          <br />
          <span style={{ color: "#FFD700", fontStyle: "italic" }}>
            Land of the free, home of the brave.
          </span>
        </div>

        <div style={{ color: "#CC2222", fontSize: "1.2rem", marginTop: "1.5rem", letterSpacing: 6 }}>
          ✦ ✦ ✦ ✦ ✦
        </div>
      </div>
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
}