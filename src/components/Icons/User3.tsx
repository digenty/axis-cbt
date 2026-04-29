import React, { SVGProps } from "react";

export const User3 = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="11"
      viewBox="0 0 8 11"
      fill="none"
      {...props}
    >
      <path
        d="M8 10.5H7V9.5C7 8.67155 6.32845 8 5.5 8H2.5C1.67158 8 1 8.67155 1 9.5V10.5H0V9.5C0 8.1193 1.11929 7 2.5 7H5.5C6.8807 7 8 8.1193 8 9.5V10.5ZM4 6C2.34315 6 1 4.65685 1 3C1 1.34315 2.34315 0 4 0C5.65685 0 7 1.34315 7 3C7 4.65685 5.65685 6 4 6ZM4 5C5.10455 5 6 4.10457 6 3C6 1.89543 5.10455 1 4 1C2.89543 1 2 1.89543 2 3C2 4.10457 2.89543 5 4 5Z"
        fill={props.fill}
      />
    </svg>
  );
};
