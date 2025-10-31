import { useState } from "react";

interface DeleteProfileModalProps {
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

const DeleteProfileModal = ({
  onClose,
  onConfirm,
  isDeleting,
}: DeleteProfileModalProps) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Delete Profile Permanently
        </h2>

        <div className="text-gray-700 mb-6 space-y-2">
          <p className="font-semibold">
            Are you sure? This action is irreversible.
          </p>
          <p className="text-sm">
            All of the following will be permanently deleted:
          </p>
          <ul className="text-sm list-disc list-inside pl-2 space-y-1">
            <li>Your profile information</li>
            <li>Your profile picture</li>
            <li>All your matches</li>
            <li>All your conversations and messages</li>
          </ul>
        </div>

        <div className="mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="mr-3 h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700 font-medium">
              I understand this action cannot be undone
            </span>
          </label>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded transition duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!isChecked || isDeleting}
            className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition duration-200 ${
              !isChecked || isDeleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isDeleting ? "Deleting..." : "Delete my profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProfileModal;
