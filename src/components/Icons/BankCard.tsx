import { SVGProps } from "react";

const BankCard = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2.25391 2.25H15.7539C16.1681 2.25 16.5039 2.58578 16.5039 3V15C16.5039 15.4142 16.1681 15.75 15.7539 15.75H2.25391C1.8397 15.75 1.50391 15.4142 1.50391 15V3C1.50391 2.58578 1.8397 2.25 2.25391 2.25ZM15.0039 8.25001H3.00391V14.25H15.0039V8.25001ZM15.0039 6.75V3.75H3.00391V6.75H15.0039ZM10.5039 11.25H13.5039V12.75H10.5039V11.25Z"
      fill={props.fill}
    />
  </svg>
);

export default BankCard;
