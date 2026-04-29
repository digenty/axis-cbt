import React, { SVGProps } from "react";

export const Folder3 = (props: SVGProps<SVGSVGElement>) => {
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
        d="M6.9428 1.33333H12.6667C13.0349 1.33333 13.3333 1.63181 13.3333 2V11.3333C13.3333 11.7015 13.0349 12 12.6667 12H0.666667C0.29848 12 0 11.7015 0 11.3333V0.666667C0 0.29848 0.29848 0 0.666667 0H5.60947L6.9428 1.33333ZM1.33333 2.66667V10.6667H12V2.66667H1.33333Z"
        fill={props.fill}
      />
    </svg>
  );
};
