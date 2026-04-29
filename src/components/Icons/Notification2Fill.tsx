import { SVGProps } from "react";

const Notification2Fill = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="15"
    height="17"
    viewBox="0 0 15 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M15 13.5H0V12H0.75V6.77355C0.75 3.03261 3.77208 0 7.5 0C11.228 0 14.25 3.03261 14.25 6.77355V12H15V13.5ZM5.625 14.25H9.375C9.375 15.2855 8.53553 16.125 7.5 16.125C6.46448 16.125 5.625 15.2855 5.625 14.25Z"
      fill={props.fill}
    />
  </svg>
);

export default Notification2Fill;
