import React, { SVGProps } from "react";

export const Check = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="9"
      viewBox="0 0 12 9"
      fill="none"
      {...props}
    >
      <path
        d="M4.24264 6.12825L10.3709 0L11.3137 0.942807L4.24264 8.01385L0 3.77125L0.942813 2.82845L4.24264 6.12825Z"
        fill={props.fill}
      />
    </svg>
  );
};
