import React, { SVGProps } from "react";

export const ArrowUpS = (props: SVGProps<SVGSVGElement>) => {
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
        d="M4.24261 1.8856L0.942806 5.18547L0 4.24267L4.24261 0L8.48527 4.24267L7.54247 5.18547L4.24261 1.8856Z"
        fill={props.fill}
      />
    </svg>
  );
};
