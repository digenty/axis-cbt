"use client";
// import { createSession } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
// import { useLogin } from "@/hooks/queryHooks/useAuth";
import { cn } from "@/lib/utils";
// import { authSchema } from "@/schema/auth";
// import { useFormik } from "formik";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LegalModal } from "./LegalModal";
import { PRIVACY_POLICY, TERMS_AND_CONDITIONS } from "./legal";

export const LoginPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  // const { mutate, isPending } = useLogin();
  const [legalModal, setLegalModal] = useState<{
    open: boolean;
    title: string;
    content: string;
  }>({
    open: false,
    title: "",
    content: "",
  });

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <form noValidate className="w-full space-y-6">
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-text-default text-sm font-medium"
        >
          Email Address
        </Label>
        <Input
          id="email"
          // onChange={formik.handleChange}
          autoFocus
          placeholder="0142562"
          // onBlur={formik.handleBlur}
          // value={formik.values.email}
          type="text"
          className={cn(
            "text-text-muted bg-bg-input-soft! w-full rounded-lg border-none text-sm font-normal",
            // formik.errors.email && formik.touched.email && "border-border-destructive border",
          )}
        />
        {/* {formik.touched.email && formik.errors.email && <p className="text-text-destructive text-xs font-light">{formik.errors.email}</p>} */}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-text-default text-sm font-medium"
        >
          Password
        </Label>

        <div
          className={cn(
            "focus-within:border-ring focus-within:ring-border-highlight text-text-muted bg-bg-input-soft flex w-full items-center rounded-lg border border-none pr-2 text-sm font-normal focus-within:ring-2 focus-within:ring-offset-2",
            // formik.errors.password && formik.touched.password && "border-border-destructive border",
          )}
        >
          <Input
            id="password"
            autoFocus
            // onChange={formik.handleChange}
            // onBlur={formik.handleBlur}
            // value={formik.values.password}
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
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
        {/* {formik.touched.password && formik.errors.password && <p className="text-text-destructive text-xs font-light">{formik.errors.password}</p>} */}
      </div>

      <div className="mt-8 space-y-4">
        <Button
          // disabled={!formik.values.email || !formik.values.password}
          className="bg-bg-state-primary disabled:bg-bg-state-primary-hover disabled:text-text-white-default hover:bg-bg-state-primary-hover! text-text-white-default h-10 w-full"
        >
          {/* {isPending && <Spinner className="text-text-white-default" />} */}
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
