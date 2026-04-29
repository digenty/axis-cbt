import React, { SVGProps } from "react";

export const BuildingFill = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="8"
      viewBox="0 0 10 8"
      fill="none"
      {...props}
    >
      <path
        d="M8.33333 6.66667H9.16667V7.5H0V6.66667H0.833333V0.416667C0.833333 0.18655 1.01988 0 1.25 0H5.41667C5.64679 0 5.83333 0.18655 5.83333 0.416667V6.66667H6.66667V2.5H7.91667C8.14679 2.5 8.33333 2.68655 8.33333 2.91667V6.66667ZM2.5 3.33333V4.16667H4.16667V3.33333H2.5ZM2.5 1.66667V2.5H4.16667V1.66667H2.5Z"
        fill={props.fill}
      />
    </svg>
  );
};
