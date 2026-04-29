import React, { SVGProps } from "react";

export const FileExcel = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="12"
      height="14"
      viewBox="0 0 12 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.8 6.66667L8.66667 9.33333H7.06667L6 7.80953L4.93333 9.33333H3.33333L5.2 6.66667L3.33333 4H4.93333L6 5.5238L7.06667 4H8V1.33333H1.33333V12H10.6667V4H8.66667L6.8 6.66667ZM0 0.6612C0 0.296033 0.298327 0 0.665667 0H8.66667L11.9998 3.33333L12 12.6617C12 13.0326 11.7034 13.3333 11.3377 13.3333H0.662267C0.296507 13.3333 0 13.0298 0 12.6721V0.6612Z"
        fill={props.fill}
      />
    </svg>
  );
};
