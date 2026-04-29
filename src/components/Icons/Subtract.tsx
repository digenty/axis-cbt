import React, { SVGProps } from "react";

export const Subtract = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="9"
      height="2"
      viewBox="0 0 9 2"
      fill="none"
      {...props}
    >
      <path d="M0 0V1.16667H8.16667V0H0Z" fill={props.fill} />
    </svg>
  );
};
