import { clearStudentSession, getStudentSessionToken } from "@/lib/auth-session";
import { decodeJWT } from "@/lib/utils";
import { JWTPayload } from "@/types";
import { useEffect, useState } from "react";

export const useLoggedInStudent = () => {
  const [currentStudent, setCurrentStudent] = useState<JWTPayload>();
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = await getStudentSessionToken();
        const student = decodeJWT(token.token);
        if (!token || !student) {
          clearStudentSession();
        } else {
          setCurrentStudent(student);
        }
      } catch (error) {
        console.warn(error);
      } finally {
        setIsUserLoading(false);
      }
    };

    fetchStudent();
  }, []);

  return {
    ...currentStudent,
    isUserLoading,
  };
};
