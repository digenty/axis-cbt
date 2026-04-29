import React, { SVGProps } from "react";

export const ExpandUpAndDown = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="7"
      height="11"
      viewBox="0 0 7 11"
      fill="none"
      {...props}
    >
      <path
        d="M6.94292 3.47141L3.47152 0L0.000100136 3.47141L0.942907 4.41421L3.47152 1.88562L6.00012 4.41421L6.94292 3.47141ZM0 7.41434L3.47139 10.8857L6.94279 7.41434L5.99999 6.47154L3.47139 9.00014L0.942807 6.47154L0 7.41434Z"
        fill={props.fill}
      />
    </svg>
  );
};
