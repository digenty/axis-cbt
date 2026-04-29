import React, { SVGProps } from "react";

export const Underline = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="13"
      viewBox="0 0 11 13"
      fill="none"
      {...props}
    >
      <path
        d="M2.66667 0V6C2.66667 7.47273 3.86057 8.66667 5.33333 8.66667C6.80607 8.66667 8 7.47273 8 6V0H9.33333V6C9.33333 8.20913 7.54247 10 5.33333 10C3.12419 10 1.33333 8.20913 1.33333 6V0H2.66667ZM0 11.3333H10.6667V12.6667H0V11.3333Z"
        fill={props.fill}
      />
    </svg>
  );
};
