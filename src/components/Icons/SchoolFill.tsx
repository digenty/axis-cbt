import React, { SVGProps } from "react";

export const SchoolFill = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="21"
      viewBox="0 0 22 21"
      fill="none"
      {...props}
    >
      <path
        d="M22 18.4142H21V8.41422H17V6L11 0L5 6V8.41422H1V18.4142H0V20.4142H22V18.4142ZM5 18.4143H3V10.4143H5V18.4143ZM17 10.4143H19V18.4143H17V10.4143ZM10 11.4143H12V18.4143H10V11.4143Z"
        fill={props.fill}
      />
    </svg>
  );
};
