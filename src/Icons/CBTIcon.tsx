import { SVGProps } from "react";

export default function CBTIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" {...props}>
      <path
        fill={props.fill}
        d="M7 5.5v2.25H4.75V5.5H7ZM3.25 4v5.25H8.5V4H3.25Zm7.5 0h6v1.5h-6V4Zm0 5.25h6v1.5h-6v-1.5Zm0 5.25h6V16h-6v-1.5Zm-1.72-1.345-1.061-1.06-2.47 2.47-1.345-1.345-1.06 1.06 2.405 2.406 3.53-3.53Z"
      />
    </svg>
  );
}
