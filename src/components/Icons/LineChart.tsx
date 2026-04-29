import { SVGProps } from "react";

const LineChart = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.75 2.25V14.25H15.75V15.75H2.25V2.25H3.75ZM15.2197 4.71967L16.2803 5.78033L12 10.0606L9.75 7.81125L6.53033 11.0303L5.46967 9.96968L9.75 5.68934L12 7.93875L15.2197 4.71967Z"
      fill={props.fill}
    />
  </svg>
);

export default LineChart;
