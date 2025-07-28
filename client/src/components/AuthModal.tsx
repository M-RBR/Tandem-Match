import { useRef, useState } from "react";
import { X } from "lucide-react";

type AuthModalProps = {
  onClose: () => void;
  mode: "signup" | "login"; // mode prop
};

function AuthModal({ onClose, mode: initialMode }: AuthModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<"signup" | "login">(initialMode); // initialMode renames mode prop inside component, only used once tol initialize local state
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const closeModal = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords must match.");
      return;
    }

    console.log(
      `${mode === "signup" ? "Signing up" : "Logging in"} with:`,
      email,
      password
    );
    onClose();
  };

  const toggleMode = () => {
    setMode(mode === "signup" ? "login" : "signup");
    setError(null);
  };

  return (
    <div
      ref={modalRef}
      onClick={closeModal}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center"
    >
      <div className="w-full max-w-sm mt-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 relative"
        >
          <button
            onClick={onClose}
            type="button"
            className="absolute top-3 right-4 text-gray-500 hover:text-black"
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-bold mb-6 text-green-700 text-center">
            {mode === "signup" ? "Sign up" : "Log in"}
          </h2>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              required
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-green-900 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="******"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-green-900 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {mode === "signup" && (
            <div className="mb-6">
              <label
                htmlFor="confirm-password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                placeholder="******"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-green-900 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <div className="flex flex-col items-center">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {mode === "signup" ? "Sign up" : "Log in"}
            </button>

            <button
              type="button"
              onClick={toggleMode}
              className="mt-4 text-sm text-green-600 hover:text-green-800"
            >
              {mode === "signup"
                ? "Already have an account? Log in"
                : "Don't have an account yet? Sign up"}
            </button>

            {mode === "signup" && (
              <p className="mt-4 text-xs text-gray-600 text-center font-bold italic">
                By clicking Sign up, you agree to the processing of your data.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;
