import { SVGProps } from "react";

const CalendarCheck = (props: SVGProps<SVGSVGElement>) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M6.75 0.75V2.25H11.25V0.75H12.75V2.25H15.75C16.1642 2.25 16.5 2.58579 16.5 3V15C16.5 15.4142 16.1642 15.75 15.75 15.75H2.25C1.83579 15.75 1.5 15.4142 1.5 15V3C1.5 2.58579 1.83579 2.25 2.25 2.25H5.25V0.75H6.75ZM15 7.5H3V14.25H15V7.5ZM11.2766 8.352L12.3373 9.41272L8.625 13.125L5.97335 10.4734L7.03401 9.41272L8.625 11.0037L11.2766 8.352ZM5.25 3.75H3V6H15V3.75H12.75V4.5H11.25V3.75H6.75V4.5H5.25V3.75Z"
      fill={props.fill}
    />
  </svg>
);

export default CalendarCheck;
