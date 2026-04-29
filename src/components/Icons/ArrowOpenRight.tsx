import React, { SVGProps } from "react";

export default function ArrowOpenRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.1144 4.51881L4.5384 0.942807L5.4812 0L10.6667 5.18548L5.4812 10.3709L4.5384 9.42808L8.1144 5.85215H0V4.51881H8.1144Z"
        fill={props.fill}
      />
    </svg>
  );
}
