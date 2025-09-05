import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {auth, db} from "../firebase/firebaseConfig";
import { updateUserInfo } from "../services/staff/updateUserInfo";
import { signOut } from "firebase/auth";
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser(userSnap.data());
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const updateUser = async (data) => {
    if (!user?.id) throw new Error("Chưa đăng nhập");
    const result = await updateUserInfo(user.id, data);
    if (result.success) {
      setUser(prev => ({ ...prev, ...data }));
    } else {
      throw result.error;
    }
  };
const logout = async () => {
  try {
    await signOut(auth); 
    setUser(null);      
  } catch (error) {
    console.error("Logout error:", error);
  }
};
  const value = {
    user,
    loading,
    updateUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

