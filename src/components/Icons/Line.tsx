import { SVGProps } from "react";

const Line = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="40"
    height="2"
    viewBox="0 0 40 2"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M0 1H40" stroke={props.fill} strokeOpacity="0.1" />
  </svg>
);

export default Line;
