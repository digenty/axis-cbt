import { deleteSession, getSessionToken } from "@/lib/cookies";
import { decodeJWT } from "@/lib/utils";
import { JWTPayload } from "@/types";
import { useEffect, useState } from "react";

export const useLoggedInUser = () => {
  const [currentUser, setCurrentUser] = useState<JWTPayload>();
  const [isUserLoading, setIsUserLoading] = useState(true);

  const getLoggedInUser = async () => {
    try {
      const token = await getSessionToken();

      const user = decodeJWT(token.token);

      if (!token || !user) {
        deleteSession();
      } else {
        setCurrentUser(user);
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setIsUserLoading(false);
    }
  };

  useEffect(() => {
    getLoggedInUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ...currentUser,
    isUserLoading,
  };
};
