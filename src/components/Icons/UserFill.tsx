import { SVGProps } from "react";

const UserFill = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="12"
    height="16"
    viewBox="0 0 12 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M0 15.75C0 12.4363 2.68629 9.75 6 9.75C9.31373 9.75 12 12.4363 12 15.75H0ZM6 9C3.51375 9 1.5 6.98625 1.5 4.5C1.5 2.01375 3.51375 0 6 0C8.48625 0 10.5 2.01375 10.5 4.5C10.5 6.98625 8.48625 9 6 9Z"
      fill={props.fill}
    />
  </svg>
);

export default UserFill;
