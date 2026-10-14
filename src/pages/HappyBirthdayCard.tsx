import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from './HappyBirthdayCard.module.css';
import { useLocation } from "react-router-dom";

const COLORS = ["#FF6B6B","#FFD93D","#6BCB77","#4D96FF","#FF6FCF","#FF9A3C","#A78BFA","#34D399"];
const SVG_NS = "http://www.w3.org/2000/svg";

type Shape = "rect" | "circle" | "star";
interface Piece { x:number; y:number; vx:number; vy:number; color:string; size:number; rotation:number; vr:number; shape:Shape; alpha:number; }
interface BalloonData { el:SVGGElement; x:number; speed:number; sway:number; swaySpeed:number; phase:number; }

export default function HappyBirthdayCard() {



    /** Search                                 = This custom variable stores the search property that is returned from the standard React Router useLocation hook and represents the query parameters in the URL. */
    const { search } : { search : string }     = useLocation();
    /** Search Parameters Instance             = This custom variable stores the standard Web API class instance of URLSearchParams that uses the previously defined {@link search} variable and provides methods for interacting with the query parameters. */
    const seaParIns  : URLSearchParams         = new URLSearchParams( search );
    /** Name Parameter String                  = This custom variable stores the name query parameter (or null) which will be used to customize the Christmas Card component's h1 element that is inside of the {@link chrCarJsx}, and it is acquired using the get method on the previously defined {@link seaParIns} URLSearchParams class instance. */
    const namParStr  : string | null           = seaParIns.get( 'name' );
    

  const cardRef    = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const svgRef     = useRef<SVGSVGElement>(null);
  const titleTopRef  = useRef<HTMLDivElement>(null);
  const titleMainRef = useRef<HTMLDivElement>(null);
  const subtitleRef  = useRef<HTMLParagraphElement>(null);
  const cakeSvgRef   = useRef<SVGSVGElement>(null);
  const ctaRef       = useRef<HTMLDivElement>(null);

  const launched     = useRef(false);
  const pieces       = useRef<Piece[]>([]);
  const rafRef       = useRef<number | null>(null);
  const balloons     = useRef<BalloonData[]>([]);
  const tickerRef    = useRef<gsap.TickerCallback | null>(null);
  const flickerTweens = useRef<gsap.core.Tween[]>([]);

  // ── Canvas confetti ──────────────────────────────────────
  function spawnConfetti(ox: number, oy: number, count = 50) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 3 + Math.random() * 9;
      pieces.current.push({
        x: ox, y: oy,
        vx: Math.cos(a) * s, vy: Math.sin(a) * s - 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 9,
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 12,
        shape: (["rect","circle","star"] as Shape[])[Math.floor(Math.random() * 3)],
        alpha: 1,
      });
    }
    if (!rafRef.current) loopConfetti();
  }

  function drawStar(ctx: CanvasRenderingContext2D, r: number) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a  = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      const ai = a + Math.PI / 5;
      i === 0 ? ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r) : ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
      ctx.lineTo(Math.cos(ai)*r*0.45, Math.sin(ai)*r*0.45);
    }
    ctx.closePath(); ctx.fill();
  }

  function loopConfetti() {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const h = canvas.height;
    pieces.current = pieces.current.filter(c => c.alpha > 0.04 && c.y < h + 20);
    pieces.current.forEach(c => {
      c.x += c.vx * 0.55; c.y += c.vy * 0.55;
      c.vy += 0.45; c.vx *= 0.98; c.rotation += c.vr;
      if (c.y > h * 0.7) c.alpha -= 0.02;
      ctx.save();
      ctx.globalAlpha = c.alpha;
      ctx.fillStyle = c.color;
      ctx.translate(c.x, c.y);
      ctx.rotate((c.rotation * Math.PI) / 180);
      if (c.shape === "rect") ctx.fillRect(-c.size/2, -c.size/4, c.size, c.size/2);
      else if (c.shape === "circle") { ctx.beginPath(); ctx.arc(0,0,c.size/2,0,Math.PI*2); ctx.fill(); }
      else drawStar(ctx, c.size/2);
      ctx.restore();
    });
    rafRef.current = pieces.current.length > 0 ? requestAnimationFrame(loopConfetti) : null;
  }

  // ── Build entrance GSAP timeline ────────────────────────
  function buildTimeline(cx: number, cy: number) {
    const tl = gsap.timeline();
    tl.add(() => spawnConfetti(cx, cy, 60))
      .from(titleTopRef.current, { opacity: 0, scale: 0, y: 30, duration: 0.6, ease: "back.out(2)" })
      .from(titleMainRef.current, { opacity: 0, scale: 0, duration: 0.55, ease: "elastic.out(1,0.5)" }, "-=0.2")
      .from(subtitleRef.current, { opacity: 0, duration: 0.5, ease: "power2.out" }, "-=0.1")
      .from(cakeSvgRef.current, { opacity: 0, scale: 0.5, y: 40, duration: 0.6, ease: "back.out(1.7)" }, "-=0.1")
      .to(ctaRef.current, { opacity: 0, duration: 0.3, ease: "power1.in",
        onComplete: () => {
          if (ctaRef.current) ctaRef.current.textContent = "tap anywhere for more confetti! 🎊";
          gsap.to(ctaRef.current, { opacity: 1, duration: 0.4 });
        }
      }, "+=0.2")
      .add(() => spawnConfetti(Math.random() * (canvasRef.current?.width ?? 440), -10, 30), "-=0.2");
    return tl;
  }

  // ── Setup balloons & flicker on mount ───────────────────
  useEffect(() => {
    const svg = svgRef.current; if (!svg) return;

    // Resize canvas
    const canvas = canvasRef.current!;
    canvas.width  = cardRef.current!.offsetWidth;
    canvas.height = cardRef.current!.offsetHeight;

    // Balloons
    const bs: BalloonData[] = Array.from({ length: 7 }, (_, i) => {
      const x     = 40 + (i / 6) * 360;
      const color = COLORS[i % COLORS.length];
      const size  = 28 + Math.random() * 18;
      const g     = document.createElementNS(SVG_NS, "g");
      g.setAttribute("opacity", "0.75");

      const body = document.createElementNS(SVG_NS, "ellipse");
      body.setAttribute("rx", String(size * 0.38));
      body.setAttribute("ry", String(size * 0.45));
      body.setAttribute("fill", color);

      const shine = document.createElementNS(SVG_NS, "ellipse");
      shine.setAttribute("cx", String(-size * 0.1));
      shine.setAttribute("cy", String(-size * 0.12));
      shine.setAttribute("rx", String(size * 0.1));
      shine.setAttribute("ry", String(size * 0.08));
      shine.setAttribute("fill", "white");
      shine.setAttribute("opacity", "0.35");

      const str = document.createElementNS(SVG_NS, "line");
      str.setAttribute("x1","0"); str.setAttribute("y1", String(size * 0.45));
      str.setAttribute("x2","0"); str.setAttribute("y2", String(size * 0.45 + 22));
      str.setAttribute("stroke", color); str.setAttribute("stroke-width","0.8"); str.setAttribute("opacity","0.6");

      g.appendChild(body); g.appendChild(shine); g.appendChild(str);
      svg.appendChild(g);

      const startY = 480 + Math.random() * 80;
      gsap.set(g, { x, y: startY });

      return { el: g, x, speed: 0.4 + Math.random() * 0.5, sway: 14 + Math.random() * 18, swaySpeed: 0.5 + Math.random() * 0.8, phase: Math.random() * Math.PI * 2 };
    });
    balloons.current = bs;

    let t = 0;
    const ticker: gsap.TickerCallback = () => {
      t++;
      bs.forEach(b => {
        const cy = (gsap.getProperty(b.el, "y") as number) - b.speed;
        const ny = cy < -60 ? 520 + Math.random() * 60 : cy;
        const nx = b.x + Math.sin(t * b.swaySpeed * 0.03 + b.phase) * b.sway;
        gsap.set(b.el, { x: nx, y: ny });
      });
    };
    gsap.ticker.add(ticker);
    tickerRef.current = ticker;

    // Candle flicker
    flickerTweens.current = [0,1,2].map(i =>
      gsap.to(`#flame${i}`, {
        scaleY: 0.75, scaleX: 1.2, transformOrigin: "bottom center",
        duration: 0.12 + i * 0.05, repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.08,
      })
    );

    return () => {
      if (tickerRef.current) gsap.ticker.remove(tickerRef.current);
      flickerTweens.current.forEach(t => t.kill());
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      bs.forEach(b => b.el.remove());
    };
  }, []);

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current!.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    if (launched.current !== true) { launched.current = true; buildTimeline(cx, cy); }
    else spawnConfetti(cx, cy, 35);
  }



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



    function resetTimeline() {

        launched.current = false;

        //if (tickerRef.current) gsap.ticker.remove(tickerRef.current);
        flickerTweens.current.forEach(t => t.kill());
        //if (rafRef.current) cancelAnimationFrame(rafRef.current);
        pieces.current = [];
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

    };



  return (
    <div id="maiConDiv" style={{ position: 'fixed', top: 0, left: 0, bottom: 0, right: 0, zIndex: '999', display:"flex", alignItems:"stretch", justifyContent:"center", width:"100vw", height:"100vh", minHeight: '100vh', }}>
      <div ref={cardRef} onClick={handleClick} style={{
        position:"relative", width:"100%", height:"100%", minHeight:400, overflow:"hidden",
        background:"linear-gradient(135deg,#1a0533 0%,#2d0a5e 40%,#0a1a4a 100%)",
        cursor:"pointer", boxShadow:"0 24px 64px rgba(0,0,0,0.45)", userSelect:"none",
      }}>
        {/* Stars */}
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} viewBox="0 0 440 540">
          {Array.from({ length: 38 }, (_, i) => (
            <circle key={i} cx={(i*137.5)%440} cy={(i*93.7+20)%540} r={i%5===0?1.5:0.8} fill="white" opacity={0.15+(i%5)*0.07}/>
          ))}
        </svg>

        {/* Balloons injected by GSAP */}
        <svg ref={svgRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:2 }} viewBox="0 0 440 540" xmlns="http://www.w3.org/2000/svg"/>

        {/* Canvas confetti */}
        <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:10 }}/>

        {/* Content */}
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"1.5rem", pointerEvents:"none", zIndex:5 }}>
          <div style={{ textAlign:"center", marginBottom:8 }}>
            <div ref={titleTopRef} className={ styles.luckiestGuyFont } style={{ fontSize:48, fontWeight:700, color:"#fff", lineHeight:1.1, textShadow:"0 2px 20px rgba(255,180,0,0.5)" }}>
              🎉 Happy
            </div>
            <div ref={titleMainRef} className={ styles.luckiestGuyFont } style={{ fontSize:62, fontWeight:800, background:"linear-gradient(90deg,#FFD93D,#FF6B6B,#A78BFA,#4D96FF,#6BCB77)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:1 }}>
              { namParStr === null ? `Birthday!` : 'Birthday,'}
            </div>
            { namParStr !== null ? <div ref={titleMainRef} className={ styles.luckiestGuyFont } style={{ fontSize:62, fontWeight:800, background:"linear-gradient(90deg,#FFD93D,#FF6B6B,#A78BFA,#4D96FF,#6BCB77)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:1 }}>
              { `${ namParStr }!` }
            </div> : null }
          </div>

          <p ref={subtitleRef} className={ styles.mysteryQuestFont } style={{ color:"rgba(255,255,255,0.85)", fontSize:16, textAlign:"center", marginBottom:24, maxWidth:300, lineHeight:1.6 }}>
            Hope your day is filled with joy, laughter,<br/>and everything you love! 🎁✨
          </p>

          <svg ref={cakeSvgRef} viewBox="0 0 140 110" style={{ width:170, height:130 }} xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="70" cy="100" rx="55" ry="8" fill="#3a1a6e" opacity="0.5"/>
            <rect x="20" y="68" width="100" height="34" rx="6" fill="#FF6B6B"/>
            <rect x="20" y="68" width="100" height="10" fill="#FF9A9A" opacity="0.4"/>
            {[30,50,70,90,110].map((x,i) => <ellipse key={i} cx={x} cy="68" rx="6" ry="4" fill="white" opacity="0.9"/>)}
            <rect x="30" y="44" width="80" height="28" rx="6" fill="#FFD93D"/>
            <rect x="30" y="44" width="80" height="10" fill="#FFE97D" opacity="0.5"/>
            {[38,58,78,98].map((x,i) => <ellipse key={i} cx={x} cy="44" rx="5" ry="3.5" fill="white" opacity="0.9"/>)}
            <rect x="41" y="26" width="8" height="18" rx="3" fill="#FF6FCF"/>
            <rect x="66" y="26" width="8" height="18" rx="3" fill="#4D96FF"/>
            <rect x="91" y="26" width="8" height="18" rx="3" fill="#6BCB77"/>
            <g id="flame0"><ellipse cx="45" cy="22" rx="3.5" ry="5" fill="#FFD93D"/><ellipse cx="45" cy="23" rx="2" ry="3" fill="#FF6B6B" opacity="0.8"/><ellipse cx="45" cy="21.5" rx="1" ry="1.5" fill="white" opacity="0.9"/></g>
            <g id="flame1"><ellipse cx="70" cy="22" rx="3.5" ry="5" fill="#FFD93D"/><ellipse cx="70" cy="23" rx="2" ry="3" fill="#FF6B6B" opacity="0.8"/><ellipse cx="70" cy="21.5" rx="1" ry="1.5" fill="white" opacity="0.9"/></g>
            <g id="flame2"><ellipse cx="95" cy="22" rx="3.5" ry="5" fill="#FFD93D"/><ellipse cx="95" cy="23" rx="2" ry="3" fill="#FF6B6B" opacity="0.8"/><ellipse cx="95" cy="21.5" rx="1" ry="1.5" fill="white" opacity="0.9"/></g>
            {([[40,80,"#A78BFA",0],[60,74,"#FF6B6B",30],[80,82,"#4D96FF",60],[50,90,"#FFD93D",90],[90,76,"#6BCB77",45],[35,88,"#FF6FCF",20],[75,68,"#FF9A3C",70]] as [number,number,string,number][]).map(([x,y,c,r],i) => (
              <rect key={i} x={x} y={y} width="5" height="2.5" rx="1" fill={c} transform={`rotate(${r},${x},${y})`}/>
            ))}
          </svg>

          <div ref={ctaRef} style={{ color:"rgba(255,255,255,0.6)", fontSize:13, letterSpacing:0.5, marginTop:8 }}>
            tap anywhere to celebrate 🎊
          </div>
        </div>
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