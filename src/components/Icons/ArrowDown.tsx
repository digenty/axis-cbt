import React, { SVGProps } from "react";

export default function ArrowDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="7"
      viewBox="0 0 11 7"
      fill="none"
      {...props}
    >
      <path
        d="M5.30326 4.12477L9.42809 0L10.6066 1.17851L5.30326 6.48185L0 1.17851L1.17851 0L5.30326 4.12477Z"
        fill={props.fill}
      />
    </svg>
  );
}
