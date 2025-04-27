import { AuthContext } from "../AuthContext";
import { useAuthProvider } from "./useAuthProvider";
const AuthProvider = ({ children }) => {
  const {user, loading, login, logout, register} = useAuthProvider();
  return (
    // Wrap the application with Auth Context which contains the data for current logged in user
    <AuthContext.Provider value={{ user, register, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
