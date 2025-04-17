import { createContext, ReactNode, useEffect, useState } from "react";

interface IScreenSizeContext {
  width: number;
  height: number;
}

export const ScreenSizeContext = createContext<IScreenSizeContext | null>(null);

export function ScreenSizeProvider({ children }: { children: ReactNode }) {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    addEventListener("resize", getScreenWidth);
    console.log(width);
    return () => removeEventListener("resize", getScreenWidth);
  }, [width, height]);

  function getScreenWidth() {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }

  return (
    <ScreenSizeContext.Provider value={{ width, height }}>{children}</ScreenSizeContext.Provider>
  );
}
