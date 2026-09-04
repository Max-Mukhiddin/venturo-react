import React, { ReactNode, useEffect, useState } from "react";
import { AuthMember } from "../../lib/types/member";
import { GlobalContext } from "../hooks/useGlobals";
import MemberService from "../services/MemberService";

const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authMember, setAuthMember] = useState<AuthMember | null>(null);
  const [authInitializing, setAuthInitializing] = useState(true);
  const [orderBuilder, setOrderBuilder] = useState<Date>(new Date());

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      try {
        const member = await new MemberService().getMyAccount();
        if (!mounted) return;

        setAuthMember(member);
        localStorage.setItem("memberData", JSON.stringify(member));
      } catch {
        if (!mounted) return;

        setAuthMember(null);
        localStorage.removeItem("memberData");
      } finally {
        if (mounted) setAuthInitializing(false);
      }
    };

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        authMember,
        setAuthMember,
        authInitializing,
        orderBuilder,
        setOrderBuilder,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default ContextProvider;
