import { SVGProps } from "react";

export default function NumStudentIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="8"
      height="11"
      viewBox="0 0 8 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8 10.5H0V9.5C0 8.1193 1.11929 7 2.5 7H5.5C6.8807 7 8 8.1193 8 9.5V10.5ZM4 6C2.34314 6 1 4.65685 1 3C1 1.34315 2.34314 0 4 0C5.65685 0 7 1.34315 7 3C7 4.65685 5.65685 6 4 6Z"
        fill={props.fill}
      />
    </svg>
  );
}
