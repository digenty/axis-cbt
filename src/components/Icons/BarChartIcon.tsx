import React, { SVGProps } from "react";

export default function BarChartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="9"
      height="8"
      viewBox="0 0 9 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0 4.16667H2.5V7.5H0V4.16667ZM2.91667 0H5.41667V7.5H2.91667V0ZM5.83333 2.08333H8.33333V7.5H5.83333V2.08333Z"
        fill={props.fill}
      />
    </svg>
  );
}
