import React, { SVGProps } from "react";

export const ArrowDownS = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="9"
      height="6"
      viewBox="0 0 9 6"
      fill="none"
      {...props}
    >
      <path
        d="M4.24261 3.29981L7.54247 0L8.48527 0.942807L4.24261 5.18548L0 0.942807L0.942807 0L4.24261 3.29981Z"
        fill={props.fill}
      />
    </svg>
  );
};
