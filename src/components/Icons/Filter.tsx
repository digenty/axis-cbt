import React, { SVGProps } from "react";

export const Filter = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill="none"
      {...props}
    >
      <path
        d="M4.66667 8H7.33333V6.66667H4.66667V8ZM0 0V1.33333H12V0H0ZM2 4.66667H10V3.33333H2V4.66667Z"
        fill={props.fill}
      />
    </svg>
  );
};
