import { SVGProps } from "react";

const Home2 = (props: SVGProps<SVGSVGElement>) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M14.25 15.7501H3.75C3.33579 15.7501 3 15.4143 3 15.0001V8.25009H0.75L8.49547 1.20872C8.78152 0.948656 9.21848 0.948656 9.50453 1.20872L17.25 8.25009H15V15.0001C15 15.4143 14.6642 15.7501 14.25 15.7501ZM4.5 14.2501H13.5V6.86818L9 2.77727L4.5 6.86818V14.2501Z"
      fill={props.fill}
    />
  </svg>
);

export default Home2;
