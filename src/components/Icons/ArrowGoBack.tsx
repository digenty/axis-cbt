import React, { SVGProps } from "react";

export const ArrowGoBack = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="13"
      height="14"
      viewBox="0 0 13 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2.55229 3.9665L4.24264 5.65686L3.29983 6.59967L0 3.29983L3.29983 0L4.24264 0.942813L2.55229 2.63317H7.33333C10.2789 2.63317 12.6667 5.02098 12.6667 7.96653C12.6667 10.912 10.2789 13.2999 7.33333 13.2999H1.33333V11.9665H7.33333C9.54247 11.9665 11.3333 10.1757 11.3333 7.96653C11.3333 5.75736 9.54247 3.9665 7.33333 3.9665H2.55229Z"
        fill={props.fill}
      />
    </svg>
  );
};
