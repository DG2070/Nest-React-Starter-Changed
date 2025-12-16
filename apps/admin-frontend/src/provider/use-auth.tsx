/* eslint-disable react-refresh/only-export-components */
import LoadingAnimation from "@/components/shared/loader";
import { Fetch } from "@/lib/fetcher";
import type { JWTS, User } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { Cookies } from "react-cookie";

interface AuthContext {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  setUser: (user: User) => void;
  setJwts: (tokens: JWTS) => void;
  logout: () => void;
  roles: string[];
}

const AuthContext = createContext<AuthContext>({
  isAuthenticated: false,
  user: null,
  loading: false,
  setUser: () => {},
  setJwts: () => {},
  logout: () => {},
  roles: [],
});
const cookies = new Cookies();
const cookieOptions = {
  path: "/",
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  maxAge: 60 * 60 * 24 * 7,
};

export const setJwts = (tokens: JWTS) => {
  cookies.remove("access_token");
  cookies.set("access_token", tokens.accessToken, cookieOptions);
  cookies.remove("refresh_token");
  cookies.set("refresh_token", tokens.refreshToken, cookieOptions);
};

export const getJwts = () => {
  return {
    access_token: cookies.get("access_token"),
    refresh_token: cookies.get("refresh_token"),
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [access_token, setAccessToken] = useState<string | null>(null);

  const logout = () => {
    cookies.remove("access_token");
    cookies.remove("refresh_token");
    setAccessToken(null);
    setUser(null);
  };
  const setTokens = (tokens: JWTS) => {
    setJwts(tokens);
    setAccessToken(tokens.accessToken);
  };

  useEffect(() => {
    const { access_token } = getJwts();
    if (access_token) {
      setAccessToken(access_token);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!access_token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    Fetch<User>({
      url: "/authentication/me",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((user: User) => {
        if (user) {
          const roles: string[] = [];
          user.roles.map((role) => roles.push(role));
          setRoles(roles);
          setUser(user);
        } else {
          logout();
        }
      })
      .catch(() => {
        logout();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [access_token]);
  const isAuthenticated = !!user;
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setUser,
        loading,
        setJwts: setTokens,
        logout,
        roles,
      }}
    >
      {loading ? <LoadingAnimation /> : children}
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
