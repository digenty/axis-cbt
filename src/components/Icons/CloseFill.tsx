import React, { SVGProps } from "react";

export const CloseFill = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      {...props}
    >
      <path
        d="M3.71231 2.88737L6.59969 0L7.42464 0.824956L4.53726 3.71232L7.42464 6.59965L6.59969 7.4246L3.71231 4.53727L0.824962 7.4246L0 6.59965L2.88736 3.71232L0 0.824956L0.824962 0L3.71231 2.88737Z"
        fill={props.fill}
      />
    </svg>
  );
};
