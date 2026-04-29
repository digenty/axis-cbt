import React, { SVGProps } from "react";

export const ArrowUpSFill = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 10.666L4 6.66602H12L8 10.666Z" fill={props.fill} />
    </svg>
  );
};
