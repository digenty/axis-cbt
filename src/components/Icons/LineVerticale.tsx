import React, { SVGProps } from "react";

export const LineVerticale = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1"
      height="20"
      viewBox="0 0 1 20"
      fill="none"
      {...props}
    >
      <path d="M0.5 0V20" stroke={props.fill} strokeOpacity="0.1" />
    </svg>
  );
};
