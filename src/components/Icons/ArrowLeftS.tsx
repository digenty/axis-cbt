import React, { SVGProps } from "react";

export const ArrowLeftS = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <path
        d="M7.21885 8.00047L10.5187 11.3003L9.57592 12.2431L5.33325 8.00047L9.57592 3.75781L10.5187 4.70062L7.21885 8.00047Z"
        fill={props.fill}
      />
    </svg>
  );
};
