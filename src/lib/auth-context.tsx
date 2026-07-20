"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface MockUser {
  id: string;
  email: string;
  name: string;
  role: "CANDIDATE" | "EMPLOYER" | "ADMIN";
  membership: "FREE" | "PREMIUM";
  avatarUrl: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: "candidate-id-alex",
    email: "candidate@opportunity.com",
    name: "Alex Mercer",
    role: "CANDIDATE",
    membership: "PREMIUM",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "employer-id-org",
    email: "employer@opportunity.com",
    name: "Global Innovation Org",
    role: "EMPLOYER",
    membership: "FREE",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "admin-id-sys",
    email: "admin@opportunity.com",
    name: "Super Administrator",
    role: "ADMIN",
    membership: "FREE",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
  }
];

interface AuthContextType {
  user: MockUser;
  login: (email: string) => boolean;
  logout: () => void;
  switchRole: (role: "CANDIDATE" | "EMPLOYER" | "ADMIN") => void;
  isLoading: boolean;
  togglePremium: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser>(MOCK_USERS[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUserEmail = localStorage.getItem("auth_user_email");
    if (savedUserEmail) {
      const foundUser = MOCK_USERS.find((u) => u.email === savedUserEmail);
      if (foundUser) {
        setUser(foundUser);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string): boolean => {
    const foundUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("auth_user_email", foundUser.email);
      return true;
    }
    return false;
  };

  const logout = () => {
    // Reset to first user as default guest
    setUser(MOCK_USERS[0]);
    localStorage.removeItem("auth_user_email");
  };

  const switchRole = (role: "CANDIDATE" | "EMPLOYER" | "ADMIN") => {
    const targetUser = MOCK_USERS.find((u) => u.role === role);
    if (targetUser) {
      setUser(targetUser);
      localStorage.setItem("auth_user_email", targetUser.email);
      // Trigger simple event so pages reload if needed
      window.dispatchEvent(new Event("storage"));
    }
  };

  const togglePremium = () => {
    setUser(prev => {
      const updated = {
        ...prev,
        membership: prev.membership === "PREMIUM" ? "FREE" as const : "PREMIUM" as const
      };
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole, isLoading, togglePremium }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
