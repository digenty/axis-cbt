import { SVGProps } from "react";

const FileExcelFill = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="30"
    height="34"
    viewBox="0 0 30 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M21.6667 0L30 8.33333V31.6803C30 32.5933 29.2585 33.3333 28.3443 33.3333H1.65567C0.741267 33.3333 0 32.5745 0 31.6803V1.653C0 0.740084 0.741583 0 1.65567 0H21.6667ZM17 16.6667L21.6667 10H17.6667L15 13.8095L12.3333 10H8.33333L13 16.6667L8.33333 23.3333H12.3333L15 19.5238L17.6667 23.3333H21.6667L17 16.6667Z"
      fill={props.fill}
    />
  </svg>
);

export default FileExcelFill;
