import { SVGProps } from "react";

const Logout = (props: SVGProps<SVGSVGElement>) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M3.75 16.5C3.33579 16.5 3 16.1642 3 15.75V2.25C3 1.83579 3.33579 1.5 3.75 1.5H14.25C14.6642 1.5 15 1.83579 15 2.25V4.5H13.5V3H4.5V15H13.5V13.5H15V15.75C15 16.1642 14.6642 16.5 14.25 16.5H3.75ZM13.5 12V9.75H8.25V8.25H13.5V6L17.25 9L13.5 12Z"
      fill={props.fill}
    />
  </svg>
);

export default Logout;
