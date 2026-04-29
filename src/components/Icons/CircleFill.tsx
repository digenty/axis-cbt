import React, { SVGProps } from "react";

export const CircleFill = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="7"
      height="7"
      viewBox="0 0 7 7"
      fill="none"
      {...props}
    >
      <path
        d="M3.33333 6.66667C5.17427 6.66667 6.66667 5.17427 6.66667 3.33333C6.66667 1.49238 5.17427 0 3.33333 0C1.49238 0 0 1.49238 0 3.33333C0 5.17427 1.49238 6.66667 3.33333 6.66667Z"
        fill={props.fill}
      />
    </svg>
  );
};
