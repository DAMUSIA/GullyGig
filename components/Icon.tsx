import React from "react";

interface IconProps {
  name: string;
  fill?: boolean;
  className?: string;
}

export default function Icon({
  name,
  fill = false,
  className = "",
}: IconProps) {
  return (
    <span
      className={`material-symbols-outlined select-none leading-none ${className}`}
      style={{
        fontVariationSettings: `'FILL' ${fill ? 1 : 0},'wght' 400,'GRAD' 0,'opsz' 24`,
      }}
    >
      {name}
    </span>
  );
}
