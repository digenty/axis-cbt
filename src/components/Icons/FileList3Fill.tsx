import { SVGProps } from "react";

const FileList3Fill = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12.75 15H2.25C1.00736 15 0 13.9927 0 12.75V0.75C0 0.33579 0.33579 0 0.75 0H11.25C11.6642 0 12 0.33579 12 0.75V9.75H15V12.75C15 13.9927 13.9927 15 12.75 15ZM12 11.25V12.75C12 13.1642 12.3358 13.5 12.75 13.5C13.1642 13.5 13.5 13.1642 13.5 12.75V11.25H12ZM3 3.75V5.25H9V3.75H3ZM3 6.75V8.25H9V6.75H3ZM3 9.75V11.25H6.75V9.75H3Z"
      fill={props.fill}
    />
  </svg>
);

export default FileList3Fill;
