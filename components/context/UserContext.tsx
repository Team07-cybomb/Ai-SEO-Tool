"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type User = { id: string; name?: string | null; email: string; image?: string | null } | null;

type UserContextType = {
  user: User;
  setUser: (user: User) => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

// A utility function to fetch the user profile from the backend
async function fetchUser(token: string): Promise<User> {
  try {
    const res = await fetch(`${API_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch {
    return null;
  }
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for social login token in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const socialToken = urlParams.get("token");

    // The token to use is either from the URL (social login) or local storage
    const effectiveToken = socialToken || localStorage.getItem("token");

    if (socialToken) {
      // Store the social login token and clean the URL to prevent flickering
      localStorage.setItem("token", socialToken);
      // `router.replace` changes the URL without adding a new entry to the history stack,
      // which prevents the user from going back to the login page with the token in the URL.
      router.replace(pathname, { scroll: false });
    }

    // Only fetch if a token exists and the user state is not already populated
    if (effectiveToken && !user) {
      fetchUser(effectiveToken).then((fetchedUser) => {
        if (fetchedUser) {
          setUser(fetchedUser);
        } else {
          // If fetching fails (e.g., invalid token), clear the token
          localStorage.removeItem("token");
          setUser(null);
        }
      });
    }
  }, [user, setUser, router, pathname]);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);