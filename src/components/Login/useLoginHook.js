import {useState, useContext} from "react";
import { AuthContext } from "../AuthContext";
import { validateEmail } from "../../utils/utils";

export const useLoginHook = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const useAuth = () => useContext(AuthContext);
  const { register, login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = isRegister
      ? await register(email, password)
      : await login(email, password);
    if (success) {
      setEmail("");
      setPassword("");
    }
  };
  const isSubmitDisabled =
    !email.length || !password.length || !validateEmail(email);

  return {email, setEmail, validateEmail, password, setPassword, isRegister, setIsRegister, handleSubmit, isSubmitDisabled}
};

