import { SVGProps } from "react";

const Edit = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4.27614 10.5935L11.0375 3.83207L10.0947 2.88926L3.33333 9.65071V10.5935H4.27614ZM4.82843 11.9268H2V9.09837L9.62333 1.47505C9.88373 1.2147 10.3058 1.2147 10.5661 1.47505L12.4518 3.36067C12.7121 3.62101 12.7121 4.04312 12.4518 4.30347L4.82843 11.9268ZM2 13.2602H14V14.5935H2V13.2602Z"
      fill={props.fill}
    />
  </svg>
);

export default Edit;
