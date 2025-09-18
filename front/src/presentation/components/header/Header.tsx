import { ReactNode } from "react";
import "./header.css";

export function Header({ children }: { children: ReactNode }) {
  return <div className="Header">{children}</div>;
}
