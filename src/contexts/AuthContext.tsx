import { createContext, useContext } from "react";
import { Navigate } from "react-router-dom";

interface AuthContextType {
  logout: () => Promise<Error | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  async function logout() {
    try {
      const authToken = localStorage.getItem("Authorization");
      if (authToken) {
        const response = await fetch(
          "https://solvent-nfkw.onrender.com/api/v1/logout",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: JSON.stringify(authToken),
            },
          },
        );

        if (response.ok) {
          localStorage.removeItem("Authorization");
        }
      }
    } catch (error) {
      return error as Error;
    }
  }

  return (
    <AuthContext.Provider value={{ logout }}>
      {localStorage.getItem("Authorization") ? (
        children
      ) : (
        <Navigate to="/login" replace={true} />
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
