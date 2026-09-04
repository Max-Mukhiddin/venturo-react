import { createContext, useContext } from "react";
import { AuthMember } from "../../lib/types/member";

interface GlobalInterface {
  authMember: AuthMember | null;
  setAuthMember: (member: AuthMember | null) => void;
  authInitializing: boolean;
  orderBuilder: Date;
  setOrderBuilder: (input: Date) => void;
}

export const GlobalContext = createContext<GlobalInterface | undefined>(
  undefined
);

export const useGlobals = () => {
    const context = useContext(GlobalContext);
    if(context === undefined) throw new Error("useGlobals within Provider");
    return context;
}
