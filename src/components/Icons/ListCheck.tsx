import { SVGProps } from "react";

const ListCheck = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.33333 0.333333H12V1.66667H3.33333V0.333333ZM0 0H2V2H0V0ZM0 4.66667H2V6.66667H0V4.66667ZM0 9.33333H2V11.3333H0V9.33333ZM3.33333 5H12V6.33333H3.33333V5ZM3.33333 9.66667H12V11H3.33333V9.66667Z"
      fill={props.fill}
    />
  </svg>
);

export default ListCheck;
