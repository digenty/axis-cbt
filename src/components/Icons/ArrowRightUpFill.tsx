import React, { SVGProps } from "react";

export const ArrowRightUpFill = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="9"
      height="9"
      viewBox="0 0 9 9"
      fill="none"
      {...props}
    >
      <path
        d="M4.71404 4.24262L0.942807 8.01389L0 7.07109L3.77124 3.29982L0.4714 0H8.01391V7.54249L4.71404 4.24262Z"
        fill={props.fill}
      />
    </svg>
  );
};
