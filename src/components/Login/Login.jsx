import { useLoginHook } from "./useLoginHook";

const AuthForm = () => {
  const {email, setEmail, validateEmail, password, setPassword, isRegister, setIsRegister, handleSubmit, isSubmitDisabled} = useLoginHook()
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100">
      <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">
          Resume Builder
        </h2>

        <form className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-300 text-sm mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {(email.length && !validateEmail(email)) ? (
              <p className="text-red-500 text-sm mb-2">Invalid Email</p>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-300 text-sm mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Password"
            />
          </div>
          <button
            className={`w-full py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              isSubmitDisabled
                ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
            type="submit"
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="inline-block align-baseline text-sm text-blue-400 hover:text-blue-300"
          >
            {isRegister ? "Switch to Login" : "Switch to Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
