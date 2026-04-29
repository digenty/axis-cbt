import { SVGProps } from "react";

const School = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="15"
    height="14"
    viewBox="0 0 15 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M7.33333 0L11.3333 4V5.60954H14V12.2762H14.6667V13.6095H0V12.2762H0.666667V5.60954H3.33333V4L7.33333 0ZM11.3333 12.2762H12.6667V6.94287H11.3333V12.2762ZM3.33333 6.94287H2V12.2762H3.33333V6.94287ZM4.66667 4.55229V12.2761H6.66667V7.60954H8V12.2761H10V4.55229L7.33333 1.88562L4.66667 4.55229Z"
      fill={props.fill}
    />
  </svg>
);

export default School;
