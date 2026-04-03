import { ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: "white" | "light" | "navy";
  divider?: "wave" | "angle" | "none";
  pattern?: "dots" | "none";
}

const backgroundStyles = {
  white: "bg-white",
  light: "bg-light-gray",
  navy: "bg-navy text-white",
};

function WaveDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div
      className={`absolute ${flip ? "top-0 rotate-180" : "bottom-0"} left-0 right-0 overflow-hidden leading-[0] z-10`}
    >
      <svg
        viewBox="0 0 1440 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        <path
          d="M0 56V28C240 0 480 0 720 28C960 56 1200 56 1440 28V56H0Z"
          className="fill-white"
        />
      </svg>
    </div>
  );
}

function AngleDivider() {
  return (
    <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0] z-10">
      <svg
        viewBox="0 0 1440 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        <polygon points="0,40 1440,0 1440,40" className="fill-white" />
      </svg>
    </div>
  );
}

function DotPattern() {
  return (
    <div
      className="absolute inset-0 opacity-[0.03] pointer-events-none"
      style={{
        backgroundImage:
          "radial-gradient(circle, #1E3A5F 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    />
  );
}

export default function SectionWrapper({
  children,
  className = "",
  id,
  background = "white",
  divider = "none",
  pattern = "none",
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`py-16 md:py-24 ${backgroundStyles[background]} relative ${className}`}
    >
      {pattern === "dots" && <DotPattern />}
      {divider === "wave" && <WaveDivider />}
      {divider === "angle" && <AngleDivider />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {children}
      </div>
    </section>
  );
}
