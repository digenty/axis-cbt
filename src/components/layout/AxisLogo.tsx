import { SVGProps } from "react";

export const AxisLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="56"
    height="20"
    viewBox="0 0 56 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="axis-grad" x1="0" y1="0" x2="56" y2="20">
        <stop offset="0%" stopColor="var(--blue-500)" />
        <stop offset="100%" stopColor="var(--violet-500)" />
      </linearGradient>
    </defs>
    <text
      x="0"
      y="16"
      fontFamily="ui-sans-serif, system-ui, sans-serif"
      fontWeight="800"
      fontSize="18"
      letterSpacing="0.5"
      fill="url(#axis-grad)"
    >
      A
    </text>
    <text
      x="14"
      y="16"
      fontFamily="ui-sans-serif, system-ui, sans-serif"
      fontWeight="800"
      fontSize="18"
      letterSpacing="0.5"
      fill="url(#axis-grad)"
    >
      X
    </text>
    <text
      x="29"
      y="16"
      fontFamily="ui-sans-serif, system-ui, sans-serif"
      fontWeight="800"
      fontSize="18"
      letterSpacing="0.5"
      fill="url(#axis-grad)"
    >
      I
    </text>
    <text
      x="38"
      y="16"
      fontFamily="ui-sans-serif, system-ui, sans-serif"
      fontWeight="800"
      fontSize="18"
      letterSpacing="0.5"
      fill="url(#axis-grad)"
    >
      S
    </text>
  </svg>
);
