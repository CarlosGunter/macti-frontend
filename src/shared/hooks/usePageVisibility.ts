"use client";

import { useEffect, useState } from "react";

/**
 * usePageVisibility - Hook para detectar si la pestaña está visible
 *
 * Útil para pausar actualizaciones de tokens cuando la pestaña no está activa,
 * reduciendo conflictos entre múltiples pestañas del mismo instituto.
 *
 * @returns {boolean} true si la página está visible, false si está oculta
 *
 * @example
 * const isVisible = usePageVisibility();
 *
 * useEffect(() => {
 *   if (isVisible) {
 *     // Reanudar actualizaciones
 *   } else {
 *     // Pausar actualizaciones
 *   }
 * }, [isVisible]);
 */
export function usePageVisibility(): boolean {
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (typeof document === "undefined") return true;
    return !document.hidden;
  });

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return isVisible;
}
