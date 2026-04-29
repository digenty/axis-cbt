import React, { SVGProps } from "react";

export const CalendarEventFill = (props: SVGProps<SVGSVGElement>) => {
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
        d="M10 1.33333H12.6667C13.0349 1.33333 13.3333 1.63181 13.3333 2V12.6667C13.3333 13.0349 13.0349 13.3333 12.6667 13.3333H0.666667C0.29848 13.3333 0 13.0349 0 12.6667V2C0 1.63181 0.29848 1.33333 0.666667 1.33333H3.33333V0H4.66667V1.33333H8.66667V0H10V1.33333ZM1.33333 5.33333V12H12V5.33333H1.33333ZM2.66667 8H6V10.6667H2.66667V8Z"
        fill={props.fill}
      />
    </svg>
  );
};
