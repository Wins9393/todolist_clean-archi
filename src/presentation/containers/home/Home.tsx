import { ReactNode } from "react";
import "./home.css";

export function Home({ children }: { children: ReactNode }) {
  return <div className="Home__Container">{children}</div>;
}
