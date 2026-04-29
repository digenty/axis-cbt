import React, { SVGProps } from "react";

export const ListCheck3 = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="12"
      viewBox="0 0 13 12"
      fill="none"
      {...props}
    >
      <path
        d="M3.47141 1.33333V3.33333H1.47141V1.33333H3.47141ZM0.138073 0V4.66667H4.80475V0H0.138073ZM6.80475 0H12.1381V1.33333H6.80475V0ZM6.80475 4.66667H12.1381V6H6.80475V4.66667ZM6.80475 9.33333H12.1381V10.6667H6.80475V9.33333ZM5.27615 8.13807L4.33333 7.19527L2.13807 9.39053L0.942807 8.19527L0 9.13807L2.13807 11.2761L5.27615 8.13807Z"
        fill={props.fill}
      />
    </svg>
  );
};
