import { useState, useEffect } from "react";

export interface BaseUser {
  _id: string;
  password?: string;
}

export interface SchoolUser extends BaseUser {
  schoolName: string;
  schoolAddress: string;
  udiseNumber: string;
}

export interface VolunteerUser extends BaseUser {
  name: string;
  email: string;
  experience: string;
  availability: string[];
  subjects: string[];
  standard: string[];
  schoolName: string;
}

export interface StudentUser extends BaseUser {
  name: string;
  standard: string;
  rollNo: string;
  sapId: string;
  schoolId: string;
  schoolName: string;
  schoolAddress: string;
}

export type UserData = SchoolUser | VolunteerUser | StudentUser;

export const useAuth = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    const loadUser = () => {
      const userData = localStorage.getItem("userData");
      const storedUserType = localStorage.getItem("userType");

      if (userData && storedUserType) {
        setUser(JSON.parse(userData));
        setUserType(storedUserType);
      }
      setIsInitialized(true);
    };

    loadUser();
  }, []);

  const login = (userData: UserData, type: string) => {
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("userType", type);
    setUser(userData);
    setUserType(type);
  };

  const logout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("userType");
    setUser(null);
    setUserType(null);
  };

  return {
    user,
    userType,
    login,
    logout,
    isInitialized,
    isAuthenticated: !!user,
  };
};
