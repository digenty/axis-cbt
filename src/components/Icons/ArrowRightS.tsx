import React, { SVGProps } from "react";

export const ArrowRightS = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="6"
      height="9"
      viewBox="0 0 6 9"
      fill="none"
      {...props}
    >
      <path
        d="M3.29985 4.24265L0 0.942807L0.942813 0L5.18545 4.24265L0.942813 8.48525L0 7.54245L3.29985 4.24265Z"
        fill={props.fill}
      />
    </svg>
  );
};
