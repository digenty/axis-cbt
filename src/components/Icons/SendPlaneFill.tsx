import { SVGProps } from "react";

const SendPlaneFill = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1.45961 6.98679C1.0677 6.85615 1.06461 6.64538 1.46767 6.51103L15.7823 1.73947C16.1787 1.60735 16.406 1.82921 16.2949 2.21792L12.205 16.5326C12.0918 16.9289 11.8633 16.9427 11.6958 16.5659L8.99997 10.5002L13.5 4.50025L7.49997 9.00022L1.45961 6.98679Z"
      fill={props.fill}
    />
  </svg>
);

export default SendPlaneFill;
