import { useEffect } from "react";

const useDebounceResizeObserver = (callback, delay) => {
  useEffect(() => {
    const handler = () => {
      clearTimeout(handler.timeout);
      handler.timeout = setTimeout(callback, delay);
    };

    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("resize", handler);
    };
  }, [callback, delay]);
};

export default useDebounceResizeObserver;
