import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { key, pathname } = useLocation();
  const positions = useRef({});

  useEffect(() => {
    // Save scroll position before navigating away
    return () => {
      positions.current[key] = window.scrollY;
    };
  }, [key]);

  useEffect(() => {
    // Scroll restoration logic:
    // If we have a saved scroll position for this location, restore it
    if (positions.current[key] !== undefined) {
      window.scrollTo(0, positions.current[key]);
    } else {
      // Otherwise scroll to top (new navigation)
      window.scrollTo(0, 0);
    }
  }, [key, pathname]);

  return null;
};

export default ScrollToTop;
