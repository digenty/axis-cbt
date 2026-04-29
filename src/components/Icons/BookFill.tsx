import React, { SVGProps } from "react";

export const BookFill = (props: SVGProps<SVGSVGElement>) => {
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
        d="M13.3333 14.6667H4.33333C3.04467 14.6667 2 13.622 2 12.3334V3.33337C2 2.22881 2.89543 1.33337 4 1.33337H13.3333C13.7015 1.33337 14 1.63185 14 2.00004V14C14 14.3682 13.7015 14.6667 13.3333 14.6667ZM12.6667 13.3334V11.3334H4.33333C3.78105 11.3334 3.33333 11.7811 3.33333 12.3334C3.33333 12.8856 3.78105 13.3334 4.33333 13.3334H12.6667Z"
        fill={props.fill}
      />
    </svg>
  );
};
