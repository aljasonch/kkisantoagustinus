"use client";

import { useEffect, useRef } from "react";

/**
 * Memunculkan isinya dengan fade-in lembut saat masuk viewport.
 * Tanpa JavaScript (atau dengan prefers-reduced-motion) konten tetap
 * terlihat normal; kelas penyembunyi baru dipasang setelah mount.
 */
export function Muncul({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.classList.add("muncul-siap");
    const pengamat = new IntersectionObserver(
      ([entri]) => {
        if (entri.isIntersecting) {
          el.classList.add("muncul-tampil");
          pengamat.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    pengamat.observe(el);
    return () => pengamat.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
