"use client";

import { createStudentSession } from "@/lib/auth-session";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useStudentLogin } from "@/hooks/queryHooks/useStudentCBT";
import { studentLoginSchema } from "@/schema/studentAuth";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/common/Toast";
import { LegalModal } from "./LegalModal";
import { PRIVACY_POLICY, TERMS_AND_CONDITIONS } from "./legal";

export const LoginPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { mutate, isPending } = useStudentLogin();

  const [legalModal, setLegalModal] = useState<{
    open: boolean;
    title: string;
    content: string;
  }>({
    open: false,
    title: "",
    content: "",
  });

  const formik = useFormik({
    initialValues: { admissionNumber: "", passcode: "" },
    validationSchema: studentLoginSchema,
    onSubmit: (values: { admissionNumber: string; passcode: string }) => {
      const { admissionNumber, passcode } = values;
      mutate(
        { admissionNumber, passcode },
        {
          onSuccess: async (data) => {
            const token = data?.data?.token;
            const assessmentId = data?.data?.assessmentId;
            const redirectTo = assessmentId
              ? `/student/cbt/${assessmentId}`
              : "/student/cbt";
            await createStudentSession(token, redirectTo);
          },

          onError: (error: unknown) => {
            const message =
              (error as { message?: string })?.message ??
              "Invalid credentials. Please try again.";
            toast({
              title: "Login failed",
              description: message,
              type: "error",
            });
          },
        },
      );
    },
  });

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <form
      noValidate
      onSubmit={formik.handleSubmit}
      className="w-full space-y-6"
    >
      <div className="space-y-2">
        <Label
          htmlFor="admissionNumber"
          className="text-text-default text-sm font-medium"
        >
          Admission Number
        </Label>
        <Input
          id="admissionNumber"
          name="admissionNumber"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.admissionNumber}
          autoFocus
          placeholder="OWN20260000110"
          type="text"
          className={cn(
            "text-text-muted bg-bg-input-soft! w-full rounded-lg border-none text-sm font-normal",
            formik.errors.admissionNumber &&
              formik.touched.admissionNumber &&
              "border-border-destructive border",
          )}
        />
        {formik.touched.admissionNumber && formik.errors.admissionNumber && (
          <p className="text-text-destructive text-xs font-light">
            {formik.errors.admissionNumber}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="passcode"
          className="text-text-default text-sm font-medium"
        >
          Passcode
        </Label>

        <div
          className={cn(
            "focus-within:border-ring focus-within:ring-border-highlight text-text-muted bg-bg-input-soft flex w-full items-center rounded-lg border border-none pr-2 text-sm font-normal focus-within:ring-2 focus-within:ring-offset-2",
            formik.errors.passcode &&
              formik.touched.passcode &&
              "border-border-destructive border",
          )}
        >
          <Input
            id="passcode"
            name="passcode"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.passcode}
            type={showPassword ? "text" : "password"}
            placeholder="Enter Passcode"
            className="text-text-muted flex-1 rounded-l-lg rounded-r-none border-none text-sm font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {showPassword ? (
            <EyeOffIcon
              className="text-icon-default-muted size-4 cursor-pointer"
              onClick={toggleShowPassword}
            />
          ) : (
            <EyeIcon
              className="text-icon-default-muted size-4 cursor-pointer"
              onClick={toggleShowPassword}
            />
          )}
        </div>
        {formik.touched.passcode && formik.errors.passcode && (
          <p className="text-text-destructive text-xs font-light">
            {formik.errors.passcode}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="rememberMe"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(!!checked)}
        />
        <Label
          htmlFor="rememberMe"
          className="text-text-muted text-sm font-normal cursor-pointer"
        >
          Remember me
        </Label>
      </div>

      <div className="mt-8 space-y-4">
        <Button
          type="submit"
          disabled={isPending || !formik.isValid || !formik.dirty}
          className="bg-bg-state-primary disabled:bg-bg-state-primary-hover disabled:text-text-white-default hover:bg-bg-state-primary-hover! text-text-white-default h-10 w-full"
        >
          {isPending && <Spinner className="text-text-white-default" />}
          Log In
        </Button>

        <p className="text-text-muted text-center text-xs">
          <button
            type="button"
            onClick={() =>
              setLegalModal({
                open: true,
                title: "Terms and Conditions",
                content: TERMS_AND_CONDITIONS,
              })
            }
            className="cursor-pointer underline"
          >
            Terms of Use
          </button>{" "}
          |{" "}
          <button
            type="button"
            onClick={() =>
              setLegalModal({
                open: true,
                title: "Privacy Policy",
                content: PRIVACY_POLICY,
              })
            }
            className="cursor-pointer underline"
          >
            Privacy Policy
          </button>
        </p>
      </div>
      <LegalModal
        open={legalModal.open}
        setOpen={(open) => setLegalModal((prev) => ({ ...prev, open }))}
        title={legalModal.title}
        content={legalModal.content}
      />
    </form>
  );
};
