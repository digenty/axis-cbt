import React, { SVGProps } from "react";

export default function Flag(props: SVGProps<SVGAElement>) {
  return (
    <svg
      width="12"
      height="13"
      viewBox="0 0 12 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.25467 0C6.50713 0 6.738 0.142667 6.85093 0.368527L7.33333 1.33333H11.3333C11.7015 1.33333 12 1.63181 12 2V9.33333C12 9.70153 11.7015 10 11.3333 10H7.07867C6.8262 10 6.59533 9.85733 6.4824 9.63147L6 8.66667H1.33333V12.6667H0V0H6.25467ZM5.8426 1.33333H1.33333V7.33333H6.82407L7.49073 8.66667H10.6667V2.66667H6.50927L5.8426 1.33333Z"
        fill={props.fill}
      />
    </svg>
  );
}
