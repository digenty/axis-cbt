import { AuthHeader } from "@/components/student/Auth/AuthHeader";
import { LoginPasswordForm } from "@/components/student/Auth/LoginPasswordForm";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

export default function ParentLoginPage() {
  return (
    <div>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner className="size-16" />
          </div>
        }
      >
        <div className="bg-bg-default grid min-h-screen w-full grid-cols-1 leading-5 md:grid-cols-2">
          <div
            className={cn(
              "hidden w-full bg-center md:block md:bg-[url(/images/bg-image-1.png)] md:bg-cover md:bg-no-repeat",
            )}
          />

          <div className="min-h-screen px-5 md:px-12">
            <AuthHeader />

            <div className="flex items-center justify-center pt-[15%]">
              <div className="w-full max-w-md flex flex-col justify-center items-center gap-7">
                <div className={cn("mt-[15%]")}>
                  <h4 className="text-text-default text-center text-lg font-semibold">
                    Welcome Back 👋🏻
                  </h4>
                  <p className="text-text-muted text-sm">
                    Log in to access your dashboard.
                  </p>
                </div>
                <LoginPasswordForm />
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
