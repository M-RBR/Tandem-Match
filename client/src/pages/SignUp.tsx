import { useState } from "react";

const SignUp = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isSignUp = true;

  console.log(email, password, confirmPassword);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isSignUp && password !== confirmPassword) {
        // Revisit and revise this whole block
        setError("Passwords need to match");
      }
      console.log("make a post request to databse");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl p-8 text-center font-bold text-green-800">
        CREATE ACCOUNT
      </h1>
      <form onSubmit={handleSubmit}>
        {/* EMAIL AND PASSWORD SECTION */}

        <section>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="email"
            required={true}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="password"
            required={true}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
          <input
            type="password-check"
            id="password-check"
            name="password-check"
            placeholder="confirm password"
            required={true}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(e.target.value)
            }
          />
        </section>
        {/* EMAIL AND PASSWORD SECTION */}
        <section></section>
        <button className="bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full">
          Submit
        </button>
        <p>{error}</p>
        <p>By clicking Sign Up, you agree to our terms...</p>
      </form>
    </div>
  );
};

export default SignUp;
