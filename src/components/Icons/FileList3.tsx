import { SVGProps } from "react";

const FileList3 = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M14.25 16.5H3.75C2.50736 16.5 1.5 15.4927 1.5 14.25V2.25C1.5 1.83579 1.83579 1.5 2.25 1.5H12.75C13.1642 1.5 13.5 1.83579 13.5 2.25V11.25H16.5V14.25C16.5 15.4927 15.4927 16.5 14.25 16.5ZM13.5 12.75V14.25C13.5 14.6642 13.8358 15 14.25 15C14.6642 15 15 14.6642 15 14.25V12.75H13.5ZM12 15V3H3V14.25C3 14.6642 3.33579 15 3.75 15H12ZM4.5 5.25H10.5V6.75H4.5V5.25ZM4.5 8.25H10.5V9.75H4.5V8.25ZM4.5 11.25H8.25V12.75H4.5V11.25Z"
      fill={props.fill}
    />
  </svg>
);

export default FileList3;
