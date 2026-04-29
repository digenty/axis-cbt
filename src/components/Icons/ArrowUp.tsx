import React, { SVGProps } from "react";

export default function ArrowUp(props: SVGProps<SVGSVGElement>) {
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
        d="M5.30326 2.357L1.17851 6.48183L0 5.30333L5.30326 0L10.6066 5.30333L9.42809 6.48183L5.30326 2.357Z"
        fill={props.fill}
      />
    </svg>
  );
}
