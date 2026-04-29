import { SVGProps } from "react";

const Store3 = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M15.75 9.75V15C15.75 15.4142 15.4142 15.75 15 15.75H3C2.58579 15.75 2.25 15.4142 2.25 15V9.75H1.5V8.25L2.25 4.5H15.75L16.5 8.25V9.75H15.75ZM3.75 9.75V14.25H14.25V9.75H3.75ZM3.02971 8.25H14.9703L14.5203 6H3.47971L3.02971 8.25ZM4.5 10.5H10.5V12.75H4.5V10.5ZM2.25 2.25H15.75V3.75H2.25V2.25Z"
      fill={props.fill}
    />
  </svg>
);

export default Store3;
