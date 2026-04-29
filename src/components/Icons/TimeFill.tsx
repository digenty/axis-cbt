import React, { SVGProps } from "react";

export const TimeFill = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.83333 11.6667C2.61167 11.6667 0 9.05497 0 5.83333C0 2.61167 2.61167 0 5.83333 0C9.05497 0 11.6667 2.61167 11.6667 5.83333C11.6667 9.05497 9.05497 11.6667 5.83333 11.6667ZM6.41667 5.83333V2.91667H5.25V7H8.75V5.83333H6.41667Z"
        fill={props.fill}
      />
    </svg>
  );
};
