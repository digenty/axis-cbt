import React, { SVGProps } from "react";

export const SendPlane = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      {...props}
    >
      <path
        d="M13.4531 0.459332L9.81752 13.1835C9.71692 13.5358 9.50052 13.5518 9.33946 13.2298L6.30192 7.15471L0.250522 4.73417C-0.0892644 4.59825 -0.0850578 4.39485 0.273222 4.27543L12.9974 0.0340454C13.3497 -0.0833946 13.5517 0.113812 13.4531 0.459332ZM11.6588 1.88569L3.51006 4.60194L7.26779 6.10504L9.29492 10.1592L11.6588 1.88569Z"
        fill={props.fill}
      />
    </svg>
  );
};
