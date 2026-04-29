import React, { SVGProps } from "react";

export const CheckDouble = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="9"
      viewBox="0 0 15 9"
      fill="none"
      {...props}
    >
      <path
        d="M7.068 5.18694L8.00933 6.12827L13.653 0.48454L14.5959 1.42735L8.00933 8.01387L3.76667 3.77121L4.70947 2.82841L6.126 4.24494L7.068 5.18694ZM7.06913 3.30181L10.3709 0L11.3111 0.940187L8.00933 4.24194L7.06913 3.30181ZM5.18465 7.07187L4.24264 8.01387L0 3.77121L0.942807 2.82841L1.88482 3.77047L1.88403 3.77121L5.18465 7.07187Z"
        fill={props.fill}
      />
    </svg>
  );
};
