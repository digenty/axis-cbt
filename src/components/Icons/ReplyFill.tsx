import React, { SVGProps } from "react";

export const ReplyFill = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="9"
      height="7"
      viewBox="0 0 9 7"
      fill="none"
      {...props}
    >
      <path
        d="M4.16667 6.66667L0 3.33333L4.16667 0V2.08333C6.46783 2.08333 8.33333 3.94883 8.33333 6.25C8.33333 6.36371 8.32879 6.47637 8.31983 6.58779C7.69187 5.39592 6.44083 4.58333 5 4.58333H4.16667V6.66667Z"
        fill={props.fill}
      />
    </svg>
  );
};
