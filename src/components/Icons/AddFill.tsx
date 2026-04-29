import { SVGProps } from "react";

export const AddFill = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      {...props}
    >
      <path
        d="M5.25 5.25V0H6.75V5.25H12V6.75H6.75V12H5.25V6.75H0V5.25H5.25Z"
        fill={props.fill}
      />
    </svg>
  );
};
