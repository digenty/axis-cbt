import { SVGProps } from "react";

const Macbook = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3 3.75V12H15V3.75H3ZM1.5 3.00561C1.5 2.5883 1.84148 2.25 2.24385 2.25H15.7561C16.167 2.25 16.5 2.58669 16.5 3.00561V13.5H1.5V3.00561ZM0.75 14.25H17.25V15.75H0.75V14.25Z"
      fill={props.fill}
    />
  </svg>
);

export default Macbook;
