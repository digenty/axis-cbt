import { SVGProps } from "react";

const UserMinusFill = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_2196_104107)">
      <path
        d="M5.83268 5.93866V9.16699H1.66602C1.66602 7.32603 3.1584 5.83366 4.99935 5.83366C5.2871 5.83366 5.56635 5.87012 5.83268 5.93866ZM4.99935 5.41699C3.6181 5.41699 2.49935 4.29824 2.49935 2.91699C2.49935 1.53574 3.6181 0.416992 4.99935 0.416992C6.3806 0.416992 7.49935 1.53574 7.49935 2.91699C7.49935 4.29824 6.3806 5.41699 4.99935 5.41699ZM9.58268 7.50033V8.33366H6.24935V7.50033H9.58268Z"
        fill={props.fill}
      />
    </g>
    <defs>
      <clipPath id="clip0_2196_104107">
        <rect width="10" height="10" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default UserMinusFill;
