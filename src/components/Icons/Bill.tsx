import { SVGProps } from "react";

const Bill = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M15 16.5H3C2.58579 16.5 2.25 16.1642 2.25 15.75V2.25C2.25 1.83579 2.58579 1.5 3 1.5H15C15.4142 1.5 15.75 1.83579 15.75 2.25V15.75C15.75 16.1642 15.4142 16.5 15 16.5ZM14.25 15V3H3.75V15H14.25ZM6 6.75H12V8.25H6V6.75ZM6 9.75H12V11.25H6V9.75Z"
      fill={props.fill}
    />
  </svg>
);

export default Bill;
