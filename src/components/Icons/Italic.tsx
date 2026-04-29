import React, { SVGProps } from "react";

export const Italic = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="7"
      height="11"
      viewBox="0 0 7 11"
      fill="none"
      {...props}
    >
      <path
        d="M5.33333 10.6667H0V9.33333H1.95107L3.36167 1.33333H1.33333V0H6.66667V1.33333H4.7156L3.305 9.33333H5.33333V10.6667Z"
        fill={props.fill}
      />
    </svg>
  );
};
