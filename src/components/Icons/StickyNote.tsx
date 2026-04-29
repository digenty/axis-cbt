import React, { SVGProps } from "react";

export const StickyNote = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <path
        d="M2.66551 14C2.29796 14 2 13.7034 2 13.3377V2.66227C2 2.29651 2.29663 2 2.66227 2H13.3377C13.7035 2 14 2.29833 14 2.66567V10.6667L10.6645 14H2.66551ZM3.33333 12.6667H10.1125L12.6667 10.1141V3.33333H3.33333V12.6667Z"
        fill={props.fill}
      />
    </svg>
  );
};
