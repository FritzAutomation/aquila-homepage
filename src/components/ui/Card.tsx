import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  accent?: "emerald" | "navy" | "none";
}

const accentStyles = {
  emerald: "border-t-2 border-t-emerald",
  navy: "border-t-2 border-t-navy",
  none: "",
};

export default function Card({ children, className = "", hover = true, accent = "none" }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl p-6 md:p-8
        border border-slate-light/20
        ${accentStyles[accent]}
        ${hover ? "transition-all duration-300 hover:shadow-lg hover:-translate-y-1" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
