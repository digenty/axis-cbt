import { SVGProps } from "react";

const CloseLarge = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8.8215 9.99977L2.32739 3.50566L3.5059 2.32715L10 8.82119L16.4941 2.32715L17.6726 3.50566L11.1785 9.99977L17.6726 16.4938L16.4941 17.6724L10 11.1783L3.5059 17.6724L2.32739 16.4938L8.8215 9.99977Z"
      fill={props.fill}
    />
  </svg>
);

export default CloseLarge;
