'use client';

import { CSSProperties, useEffect, useRef, useState } from 'react';

export interface BurnTransitionProps {
  preview?: boolean;
  color?: string;
  transitionColor?: string;
  noiseScale?: number;
  noiseIntensity?: number;
  baseAnimationSpeed?: number;
  edgeSoftness?: number;
  bloomIntensity?: number;
  bloomRadius?: number;
  scrollStart?: number;
  scrollEnd?: number;
  className?: string;
  style?: CSSProperties;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
function lerp(t: number, a: number, b: number) {
  return a + clamp(t, 0, 1) * (b - a);
}

export function BurnTransition({
  preview = false,
  color = '#f1f1f1',
  transitionColor,
  noiseScale = 0.42,
  noiseIntensity = 0.58,
  baseAnimationSpeed = 0.06,
  edgeSoftness = 0.52,
  bloomIntensity = 0.0,
  bloomRadius = 0.15,
  scrollStart = 0.35,
  scrollEnd = 0.62,
  className,
  style,
}: BurnTransitionProps) {
  const svgRef   = useRef<SVGSVGElement>(null);
  const rafRef   = useRef<number | null>(null);
  const phaseRef = useRef(0);
  const lastTRef = useRef(0);
  const [uid]    = useState(() => Math.random().toString(36).slice(2, 7));

  const p = useRef({
    preview, color, transitionColor, noiseScale, noiseIntensity,
    baseAnimationSpeed, edgeSoftness, bloomIntensity,
    bloomRadius, scrollStart, scrollEnd,
  });

  useEffect(() => {
    p.current = {
      preview, color, transitionColor, noiseScale, noiseIntensity,
      baseAnimationSpeed, edgeSoftness, bloomIntensity,
      bloomRadius, scrollStart, scrollEnd,
    };
  }, [
    preview, color, transitionColor, noiseScale, noiseIntensity,
    baseAnimationSpeed, edgeSoftness, bloomIntensity,
    bloomRadius, scrollStart, scrollEnd,
  ]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const VH = 1000;
    const g  = <T extends Element>(id: string) => svg.getElementById(id) as T | null;

    const getLineY = (): number => {
      const pr          = p.current;
      const totalScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const frac        = (window.scrollY || window.pageYOffset) / totalScroll;
      const progress    = clamp(
        (frac - pr.scrollStart) / Math.max(0.001, pr.scrollEnd - pr.scrollStart),
        0, 1,
      );
      return lerp(progress, VH + 120, -120);
    };

    const applyFrame = (lineY: number) => {
      const pr = p.current;

      const macroFreqX = lerp(pr.noiseScale, 0.002, 0.008);
      const macroFreqY = lerp(pr.noiseScale, 0.004, 0.014);
      const microFreqX = lerp(pr.noiseScale, 0.010, 0.030);
      const microFreqY = lerp(pr.noiseScale, 0.020, 0.060);

      const macroDisp  = lerp(pr.noiseIntensity, 60,  280);
      const microDisp  = lerp(pr.noiseIntensity, 15,   60);

      const edgePx = lerp(pr.edgeSoftness, 80, 220);
      const blurPx = lerp(pr.bloomRadius,   4,  30);

      g<SVGFETurbulenceElement>(`ftb-macro-${uid}`)?.setAttribute('baseFrequency', `${macroFreqX.toFixed(4)} ${macroFreqY.toFixed(4)}`);
      g<SVGFETurbulenceElement>(`ftb-micro-${uid}`)?.setAttribute('baseFrequency', `${microFreqX.toFixed(4)} ${microFreqY.toFixed(4)}`);
      g<SVGFEDisplacementMapElement>(`disp-macro-${uid}`)?.setAttribute('scale', String(macroDisp));
      g<SVGFEDisplacementMapElement>(`disp-micro-${uid}`)?.setAttribute('scale', String(microDisp));
      g<SVGFEGaussianBlurElement>(`blur-glow-${uid}`)?.setAttribute('stdDeviation', String(blurPx));

      const curtain = g<SVGRectElement>(`curtain-${uid}`);
      if (curtain) {
        curtain.setAttribute('y',      String(lineY - edgePx * 0.1));
        curtain.setAttribute('height', String(VH + 300 - (lineY - edgePx * 0.1)));
        curtain.setAttribute('fill',   pr.color);
      }

      const burnEdge = g<SVGRectElement>(`burn-edge-${uid}`);
      if (burnEdge) {
        burnEdge.setAttribute('y',      String(lineY - edgePx));
        burnEdge.setAttribute('height', String(edgePx * 1.2));
        burnEdge.setAttribute('fill',   pr.color);
      }

      const glowEdge = g<SVGRectElement>(`glow-edge-${uid}`);
      if (glowEdge) {
        glowEdge.setAttribute('y',       String(lineY - edgePx * 0.8));
        glowEdge.setAttribute('height',  String(edgePx * 0.8));
        glowEdge.setAttribute('fill',    pr.transitionColor ?? pr.color);
        glowEdge.setAttribute('opacity', pr.bloomIntensity > 0 ? String(pr.bloomIntensity) : '0');
      }
    };

    const tick = (t: number) => {
      const pr = p.current;
      const dt = t - lastTRef.current;
      lastTRef.current  = t;
      if (!pr.preview) phaseRef.current += dt;

      const speed = lerp(pr.baseAnimationSpeed, 0.00005, 0.00026);
      const seedA = 7
        + Math.sin(phaseRef.current * speed)         * 5
        + Math.cos(phaseRef.current * speed * 0.41)  * 2;
      const seedB = 13
        + Math.cos(phaseRef.current * speed * 0.73)  * 4
        + Math.sin(phaseRef.current * speed * 0.29)  * 2;

      g<SVGFETurbulenceElement>(`ftb-macro-${uid}`)?.setAttribute('seed', seedA.toFixed(3));
      g<SVGFETurbulenceElement>(`ftb-micro-${uid}`)?.setAttribute('seed', seedB.toFixed(3));

      const lineY = getLineY();
      if (svg) svg.style.visibility = lineY > VH + 80 ? 'hidden' : 'visible';
      applyFrame(lineY);
      rafRef.current = requestAnimationFrame(tick);
    };

    lastTRef.current = performance.now();
    rafRef.current   = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [uid]);

  return (
    <div
      className={className}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
        ...style,
      }}
    >
      <svg
        ref={svgRef}
        fill="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          
          <filter id={`f-main-${uid}`} x="-5%" y="-80%" width="110%" height="300%" colorInterpolationFilters="sRGB">
           
            <feTurbulence
              id={`ftb-macro-${uid}`}
              type="fractalNoise"
              baseFrequency="0.003 0.006"
              numOctaves={2}
              seed={7}
              result="macro-noise"
            />
            <feDisplacementMap
              id={`disp-macro-${uid}`}
              in="SourceGraphic"
              in2="macro-noise"
              scale={200}
              xChannelSelector="R"
              yChannelSelector="G"
              result="macro-warped"
            />
            
            <feTurbulence
              id={`ftb-micro-${uid}`}
              type="fractalNoise"
              baseFrequency="0.015 0.040"
              numOctaves={4}
              seed={13}
              result="micro-noise"
            />
            <feDisplacementMap
              id={`disp-micro-${uid}`}
              in="macro-warped"
              in2="micro-noise"
              scale={40}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          <filter id={`f-glow-${uid}`} x="-5%" y="-80%" width="110%" height="260%" colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.003 0.006"
              numOctaves={2}
              seed={7}
              result="gnoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="gnoise"
              scale={160}
              xChannelSelector="R"
              yChannelSelector="G"
              result="gwarped"
            />
            <feGaussianBlur id={`blur-glow-${uid}`} in="gwarped" stdDeviation={14} result="gblur" />
            <feColorMatrix in="gblur" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 3 -0.5" />
          </filter>

          <clipPath id={`clip-${uid}`}>
            <rect x="-120" y="-300" width="1240" height="1800" />
          </clipPath>
        </defs>

        <g clipPath={`url(#clip-${uid})`}>
          <rect
            id={`curtain-${uid}`}
            x={-120} y={1200} width={1240} height={600}
          />
          <rect
            id={`glow-edge-${uid}`}
            x={-120} y={1200} width={1240} height={80}
            filter={`url(#f-glow-${uid})`}
            opacity={0}
          />
          <rect
            id={`burn-edge-${uid}`}
            x={-120} y={1200} width={1240} height={300}
            filter={`url(#f-main-${uid})`}
          />
        </g>
      </svg>
    </div>
  );
}

export default BurnTransition;