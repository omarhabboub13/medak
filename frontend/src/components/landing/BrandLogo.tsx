"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Static brand mark — replace `public/medak-logo.png` to change it */
export const LOGO_SRC = "/medak-logo.png";

type Metrics = { width: number; height: number; aspect: number };

function slotForAspect(aspect: number, viewport: number) {
  // Fit logo into a navbar slot using its real aspect ratio
  const wide = aspect >= 1.75;
  const landscape = aspect >= 1.15;
  const mobile = viewport < 640;
  const tablet = viewport < 1024;

  if (wide) {
    return {
      height: mobile ? 48 : tablet ? 56 : 64,
      maxWidth: mobile ? 180 : tablet ? 240 : 300,
    };
  }

  if (landscape) {
    return {
      height: mobile ? 52 : tablet ? 60 : 68,
      maxWidth: mobile ? 160 : tablet ? 210 : 260,
    };
  }

  return {
    height: mobile ? 44 : tablet ? 52 : 60,
    maxWidth: mobile ? 72 : tablet ? 88 : 100,
  };
}

function readMetrics(img: HTMLImageElement): Metrics | null {
  const width = img.naturalWidth;
  const height = img.naturalHeight;
  if (!width || !height) return null;
  return { width, height, aspect: width / height };
}

export default function BrandLogo({
  src = LOGO_SRC,
  className = "",
}: {
  src?: string;
  className?: string;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [viewport, setViewport] = useState(1280);

  useEffect(() => {
    const sync = () => setViewport(window.innerWidth);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const applyMetrics = useCallback((img: HTMLImageElement) => {
    const next = readMetrics(img);
    if (next) setMetrics(next);
  }, []);

  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete) applyMetrics(img);
  }, [src, applyMetrics]);

  const slot = metrics
    ? slotForAspect(metrics.aspect, viewport)
    : { height: 56, maxWidth: 220 };

  let displayH = slot.height;
  let displayW = metrics ? displayH * metrics.aspect : slot.maxWidth;
  if (displayW > slot.maxWidth) {
    displayW = slot.maxWidth;
    displayH = metrics ? displayW / metrics.aspect : slot.height;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={src}
      alt="Medak"
      onLoad={(e) => applyMetrics(e.currentTarget)}
      width={metrics?.width ?? undefined}
      height={metrics?.height ?? undefined}
      style={{
        width: Math.round(displayW * 10) / 10,
        height: Math.round(displayH * 10) / 10,
        maxWidth: "100%",
      }}
      className={`block object-contain object-left rtl:object-right ${className}`}
    />
  );
}
