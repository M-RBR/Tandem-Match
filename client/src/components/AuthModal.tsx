import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Eye, EyeOff } from "lucide-react";
import { useUser } from "../contexts/useUser";
import { baseURL } from "../utils/baseURL";

type AuthModalProps = {
  onClose: () => void;
  mode: "signup" | "login";
};

function AuthModal({ onClose, mode: initialMode }: AuthModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { setUser } = useUser();

  const [mode, setMode] = useState<"signup" | "login">(initialMode);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const closeModal = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(pwd)) {
      return "Password must contain at least one capital letter.";
    }
    if (!/[0-9]/.test(pwd)) {
      return "Password must contain at least one number.";
    }
    if (!/[!@#$%^&*()_+\-={};':"\\|,.<>/?~]/.test(pwd)) {
      return "Password must contain at least one special character (e.g. !, ?, #).";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === "signup") {
        if (!password || !confirmPassword) {
          throw new Error("Please enter and confirm your password.");
        }

        if (password !== confirmPassword) {
          throw new Error("Passwords must match.");
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
          throw new Error(passwordError);
        }

        const response = await fetch(`${baseURL}/users/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Registration failed");
        }

        console.log("Registration successful:", data);

        setUser(data.user, data.token);
        onClose();
      } else {
        const response = await fetch(`${baseURL}/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Login failed");
        }

        console.log("Login successful:", data);

        setUser(data.user, data.token);

        onClose();
        navigate("/dashboard", { state: { email } });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Authentication error:", err);
    } finally {
      setIsLoading(false);
    }
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-green-900 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* LOG IN SIDE OF MODAL */}

          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="******"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-green-900 leading-tight focus:outline-none focus:shadow-outline"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-black"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* SIGN UP SIDE OF MODAL */}

          {mode === "signup" && (
            <div className="mb-6 relative">
              <label
                htmlFor="confirm-password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="******"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-green-900 leading-tight focus:outline-none focus:shadow-outline"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-black"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <div className="flex flex-col items-center">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {mode === "signup" ? "Sign up" : "Log in"}
            </button>

            <button
              type="button"
              onClick={toggleMode}
              disabled={isLoading}
              className="mt-4 text-sm text-green-700 hover:text-green-800 "
            >
              {mode === "signup"
                ? "Already have an account? Log in!"
                : "Don't have an account yet? Sign up!"}
            </button>

            {mode === "signup" && (
              <p className="mt-4 text-xs text-gray-400 text-center font-bold italic">
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
