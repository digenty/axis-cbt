import { SVGProps } from "react";

const FileList2 = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="12"
    height="14"
    viewBox="0 0 12 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11.3333 13.3333H0.666667C0.29848 13.3333 0 13.0349 0 12.6667V0.666667C0 0.29848 0.29848 0 0.666667 0H11.3333C11.7015 0 12 0.29848 12 0.666667V12.6667C12 13.0349 11.7015 13.3333 11.3333 13.3333ZM10.6667 12V1.33333H1.33333V12H10.6667ZM3.33333 3.33333H8.66667V4.66667H3.33333V3.33333ZM3.33333 6H8.66667V7.33333H3.33333V6ZM3.33333 8.66667H6.66667V10H3.33333V8.66667Z"
      fill={props.fill}
    />
  </svg>
);

export default FileList2;
