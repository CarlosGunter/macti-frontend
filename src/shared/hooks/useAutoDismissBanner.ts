import { useEffect, useState } from "react";

/**
 * Custom hook to manage the visibility of a banner with auto-dismiss functionality.
 * @param message The message to display in the banner.
 * @param duration The duration (in milliseconds) before the banner is dismissed. Default is 5000ms.
 * @returns A boolean indicating whether the banner is visible.
 */
export function useAutoDismissBanner(message: string | null, duration: number = 5000) {
  const [isBannerVisible, setIsBannerVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setIsBannerVisible(true);
      const timer = setTimeout(() => setIsBannerVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  return isBannerVisible;
}
