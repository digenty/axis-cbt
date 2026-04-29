import React, { SVGProps } from "react";

export const ArrowRightCircleFill = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      {...props}
    >
      <path
        d="M6.66667 0C10.3467 0 13.3333 2.98667 13.3333 6.66667C13.3333 10.3467 10.3467 13.3333 6.66667 13.3333C2.98667 13.3333 0 10.3467 0 6.66667C0 2.98667 2.98667 0 6.66667 0ZM6.66667 6H4V7.33333H6.66667V9.33333L9.33333 6.66667L6.66667 4V6Z"
        fill={props.fill}
      />
    </svg>
  );
};
