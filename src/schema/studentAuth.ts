import * as Yup from "yup";

export const studentLoginSchema = Yup.object({
  admissionNumber: Yup.string().required("Admission number is required"),
  passcode: Yup.string().required("Passcode is required"),
});
