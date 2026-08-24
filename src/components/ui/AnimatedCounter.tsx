"use client";

import { useEffect, useRef } from "react";
import {
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

/** Broj koji se animirano "penje" do ciljne vrednosti kad uđe u viewport. */
export function AnimatedCounter({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1800, bounce: 0 });

  useEffect(() => {
    // Krećemo od nule tek kad je element u viewportu — do tada u DOM-u
    // stoji ciljna vrednost (vidljiva i bez JS-a / crawlerima).
    if (!inView || reduce) return;
    if (ref.current) ref.current.textContent = `0${suffix}`;
    motionValue.set(value);
  }, [inView, value, motionValue, reduce, suffix]);

  useEffect(() => {
    if (reduce) return;
    return spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${Math.round(latest)}${suffix}`;
      }
    });
  }, [spring, suffix, value, reduce]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}
