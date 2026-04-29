import React, { SVGProps } from "react";

export default function Mail(props: SVGProps<SVGElement>) {
  return (
    <svg
      width="14"
      height="12"
      viewBox="0 0 14 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.666667 0H12.6667C13.0349 0 13.3333 0.29848 13.3333 0.666667V11.3333C13.3333 11.7015 13.0349 12 12.6667 12H0.666667C0.29848 12 0 11.7015 0 11.3333V0.666667C0 0.29848 0.29848 0 0.666667 0ZM12 2.82528L6.71453 7.55867L1.33333 2.81063V10.6667H12V2.82528ZM1.67431 1.33333L6.70793 5.77467L11.6673 1.33333H1.67431Z"
        fill={props.fill}
      />
    </svg>
  );
}
