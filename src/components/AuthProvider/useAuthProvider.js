
import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase";

export const useAuthProvider = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      });
      return unsubscribe;
    }, []);
  
    const register = async (email, password) => {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        logout();
        alert("User Registered Successfully");
        return true;
      } catch (error) {
        alert(error.message);
        return false;
      }
    };
  
    const login = async (email, password) => {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        return true;
      } catch (error) {
        alert(error.message);
        return false;
      }
    };
  
    const logout = async () => {
      try {
        await signOut(auth);
      } catch (error) {
        alert(error.message);
      }
    };
    return {user, loading, login, logout, register};
}
