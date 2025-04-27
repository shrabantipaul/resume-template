import { useContext } from "react";
import { AuthContext } from "./components/AuthContext";
import "./App.css";
import Login from "./components/Login/Login";
import AddResume from "./components/AddResume/AddResume";

const App = () => {
  const useAuth = () => useContext(AuthContext);
  const { user, logout } = useAuth();
  return !user ? (
    <Login />
  ) : (
    // if user is logged in then show template to add resume with logout button
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-8">
    <button
        className="absolute top-4 right-8 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={logout}
      >
        Logout
      </button>
      <AddResume />
    </div>
  );
};

export default App;
