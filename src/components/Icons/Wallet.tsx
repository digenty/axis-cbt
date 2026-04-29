import { SVGProps } from "react";

const Wallet = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M13.5039 5.25H15.7539C16.1681 5.25 16.5039 5.58578 16.5039 6V15C16.5039 15.4142 16.1681 15.75 15.7539 15.75H2.25391C1.8397 15.75 1.50391 15.4142 1.50391 15V3C1.50391 2.58578 1.8397 2.25 2.25391 2.25H13.5039V5.25ZM3.00391 6.75V14.25H15.0039V6.75H3.00391ZM3.00391 3.75V5.25H12.0039V3.75H3.00391ZM11.2539 9.75001H13.5039V11.25H11.2539V9.75001Z"
      fill={props.fill}
    />
  </svg>
);

export default Wallet;
