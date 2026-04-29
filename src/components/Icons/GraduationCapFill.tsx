import React, { SVGProps } from "react";

export default function GraduationCapFill(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="10"
      height="9"
      viewBox="0 0 10 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5 0L0 2.91667L5 5.83333L9.16667 3.40279V6.45833H10V2.91667L5 0ZM1.66626 4.78771V6.66671C2.42643 7.67875 3.63672 8.33337 4.99992 8.33337C6.36308 8.33337 7.57337 7.67875 8.33354 6.66671L8.33337 4.78804L5.00012 6.73246L1.66626 4.78771Z"
        fill={props.fill}
      />
    </svg>
  );
}
