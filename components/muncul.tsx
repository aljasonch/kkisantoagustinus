"use client";

import { useEffect, useRef } from "react";

/**
 * Memunculkan isinya dengan fade-in lembut saat masuk viewport.
 * Bila elemen sudah berada di dalam/dekat viewport saat halaman dimuat,
 * elemen langsung ditampilkan tanpa efek berkedip atau menghilang.
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

    const pengamat = new IntersectionObserver(
      ([entri]) => {
        if (entri.isIntersecting) {
          el.classList.add("muncul-tampil");
          pengamat.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px 50px 0px" }
    );

    // Cek posisi elemen terhadap viewport saat pertama dimuat
    const rect = el.getBoundingClientRect();
    const diViewport = rect.top < window.innerHeight + 100 && rect.bottom > -50;

    if (diViewport) {
      el.classList.add("muncul-siap", "muncul-tampil");
    } else {
      el.classList.add("muncul-siap");
      pengamat.observe(el);
    }

    return () => pengamat.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

