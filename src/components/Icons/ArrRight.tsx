import React, { SVGProps } from "react";

export const ArrRight = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="10"
      viewBox="0 0 11 10"
      fill="none"
      {...props}
    >
      <path
        d="M8.64665e-05 5.99995L0 2.00272e-05L1.33333 0L1.3334 4.66662L8.11463 4.66669L5.48149 2.03351L6.42429 1.09071L10.6669 5.33335L6.42429 9.57602L5.48149 8.63315L8.11463 6.00002L8.64665e-05 5.99995Z"
        fill={props.fill}
      />
    </svg>
  );
};
