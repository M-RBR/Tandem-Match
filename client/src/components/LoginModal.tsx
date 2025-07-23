import { useRef } from "react";
import { X } from "lucide-react";

type LoginModalProps = {
  onClose: () => void;
};

function LoginModal({ onClose }: LoginModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const closeModal = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  return (
    <div
      ref={modalRef}
      onClick={closeModal}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center"
    >
      <div className="w-full max-w-sm mt-10">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-500 hover:text-black"
          >
            <X size={20} />
          </button>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-green-900 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text" // decide whether login with email or other options
              placeholder="Enter username"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-green-900 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Log in
            </button>
            <a
              className="inline-block align-baseline font-bold text-sm text-green-600 hover:text-green-700"
              href="#" // add link to sign up page
            >
              Not registered yet? <br /> Create an account!
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
