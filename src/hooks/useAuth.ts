import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext, User } from "@/context/AuthContext";

export type { User };

export const useAuth = () => {
  const navigate = useNavigate();
  const context = useAuthContext();

  const signOut = useCallback(async () => {
    await context.signOut();
    navigate("/login");
  }, [context, navigate]);

  return {
    ...context,
    signOut,
  };
};
