import React, { SVGProps } from "react";

export const ArrowUpDown = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="12"
      viewBox="0 0 14 12"
      fill="none"
      {...props}
    >
      <path
        d="M6.59967 3.29983L5.65687 4.24264L3.967 2.552L3.9665 11.3333H2.63317L2.63367 2.552L0.942813 4.24264L0 3.29983L3.29983 0L6.59967 3.29983ZM13.2663 8.7002L9.96647 12L6.66667 8.7002L7.60947 7.75733L9.30034 9.448L9.29981 0.666667H10.6331L10.6337 9.448L12.3235 7.75733L13.2663 8.7002Z"
        fill={props.fill}
      />
    </svg>
  );
};
