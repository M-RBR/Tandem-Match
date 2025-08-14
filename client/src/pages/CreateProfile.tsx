import React, { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import AsyncSelect from "react-select/async";
import languageData from "../data/languages.json";
import { useAuthFetch } from "../utils/authFetch";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const LANGUAGE_LEVELS = [
  "Beginner",
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
  "Native",
];
const MAX_LANGUAGES = 3;

const languageOptions = Object.entries(languageData).map(([code, name]) => ({
  value: code,
  label: name,
}));

const filterLanguages = (inputValue: string) => {
  return languageOptions.filter((i) =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};

type LanguageOption = {
  label: string;
  value: string;
};

const loadOptions = (inputValue: string): Promise<LanguageOption[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(filterLanguages(inputValue));
    }, 500);
  });
};

const LanguageSelector = ({
  value,
  onChange,
  onRemove,
}: {
  value: { language: { value: string; label: string } | null; level: string };
  onChange: (val: {
    language: { value: string; label: string } | null;
    level: string;
  }) => void;
  onRemove?: () => void;
}) => {
  return (
    <div className="flex gap-2 items-center mb-3">
      <div className="flex-1">
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={loadOptions}
          value={value.language}
          onChange={(selected) => onChange({ ...value, language: selected })}
          placeholder="Select language"
        />
      </div>
      <select
        value={value.level}
        onChange={(e) => onChange({ ...value, level: e.target.value })}
        className="border p-2 rounded"
      >
        <option value="">Level</option>
        {LANGUAGE_LEVELS.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-red-500 hover:text-white hover:bg-red-500 font-bold w-6 h-6 flex items-center justify-center rounded-full border border-red-500 transition-colors duration-200"
          aria-label="Remove language"
        >
          ×
        </button>
      )}
    </div>
  );
};

const CreateProfile = () => {
  const [spokenLanguages, setSpokenLanguages] = useState<
    { language: { value: string; label: string } | null; level: string }[]
  >([]);
  const [learningLanguages, setLearningLanguages] = useState<
    { language: { value: string; label: string } | null; level: string }[]
  >([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const authFetch = useAuthFetch();
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.first_name) {
      setIsEditing(true);

      if (user.spoken_languages?.length) {
        setSpokenLanguages(
          user.spoken_languages.map((lang) => ({
            language: {
              value: lang.code,
              label:
                languageData[lang.code as keyof typeof languageData] ||
                lang.name,
            },
            level: lang.level,
          }))
        );
      }

      if (user.learning_languages?.length) {
        setLearningLanguages(
          user.learning_languages.map((lang) => ({
            language: {
              value: lang.code,
              label:
                languageData[lang.code as keyof typeof languageData] ||
                lang.name,
            },
            level: lang.level,
          }))
        );
      }

      if (user.image) {
        setPreviewUrl(user.image);
      }
    }
  }, [user]);

  const handleChange = () => {};

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setErrorMessage("Only JPEG or PNG images are allowed");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Image must be smaller than 5MB");
        return;
      }

      setImageFile(file);
      setErrorMessage(null);

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    const hasValidSpoken = spokenLanguages.some(
      (entry) => entry.language !== null && entry.level
    );
    const hasValidLearning = learningLanguages.some(
      (entry) => entry.language !== null && entry.level
    );

    if (!hasValidSpoken || !hasValidLearning) {
      setErrorMessage(
        "Please select at least one spoken and one learning language with their levels"
      );
      setIsUploading(false);
      return;
    }

    if (!previewUrl) {
      setErrorMessage("Please upload a profile picture");
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    const target = e.target as typeof e.target & {
      first_name: { value: string };
      dob_day: { value: string };
      gender_identity: { value: string };
      gender_interest: { value: string };
      about: { value: string };
    };

    formData.append("first_name", target.first_name.value);
    formData.append(
      "dob_day",
      new Date(target.dob_day.value).toISOString().split("T")[0]
    );
    formData.append("gender_identity", target.gender_identity.value);
    formData.append("gender_interest", target.gender_interest.value);
    formData.append("about", target.about.value);

    formData.append(
      "spoken_languages",
      JSON.stringify(
        spokenLanguages.map((l) => ({
          code: l.language?.value,
          name: l.language?.label,
          level: l.level,
        }))
      )
    );

    formData.append(
      "learning_languages",
      JSON.stringify(
        learningLanguages.map((l) => ({
          code: l.language?.value,
          name: l.language?.label,
          level: l.level,
        }))
      )
    );

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await authFetch(`/users/update/${user?._id}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setUser({
        ...user,
        ...data,
        spoken_languages: data.spoken_languages,
        learning_languages: data.learning_languages,
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Upload failed:", error);
      setErrorMessage("Profile update failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6">
      <h3 className="text-4xl text-green-700 font-bold italic text-center mb-12">
        {isEditing ? "UPDATE PROFILE" : "CREATE PROFILE"}
      </h3>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <section className="flex-1 bg-white p-6 rounded-lg shadow-lg">
            <div className="mb-4">
              <label
                htmlFor="first_name"
                className="block text-green-800 font-medium mb-4"
              >
                First Name
              </label>
              <input
                id="first_name"
                type="text"
                name="first_name"
                placeholder="Type your profile name"
                required
                onChange={handleChange}
                defaultValue={user?.first_name || ""}
                className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <label className="block text-green-800 font-medium mb-2">
                Birthday
              </label>
              <div>
                <input
                  id="dob_day"
                  type="date"
                  name="dob_day"
                  placeholder="day"
                  required
                  onChange={handleChange}
                  defaultValue={user?.dob_day || ""}
                  className="w-1/3 p-2 border border-green-300 rounded"
                />
              </div>
            </div>

            <div className="mb-4 flex items-center gap-4">
              <label className="text-green-800 font-medium whitespace-nowrap">
                My gender:
              </label>
              <div className="flex gap-7">
                {["man", "woman", "diverse"].map((gender) => (
                  <label
                    key={gender}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      id={`${gender}-gender-identity`}
                      type="radio"
                      name="gender_identity"
                      value={gender}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500"
                      required
                      defaultChecked={user?.gender_identity === gender}
                    />
                    <span className="ml-2 text-green-700 capitalize">
                      {gender}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4 flex items-center gap-7">
              <label className="text-green-800 font-medium whitespace-nowrap">
                Show me:
              </label>
              <div className="flex gap-6">
                {["men", "women", "everyone"].map((interest) => (
                  <label
                    key={interest}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      id={`${interest}-gender-interest`}
                      type="radio"
                      name="gender_interest"
                      value={interest}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500"
                      required
                      defaultChecked={user?.gender_interest === interest}
                    />
                    <span className="ml-2 text-green-700 capitalize">
                      {interest === "everyone" ? "Everyone" : interest}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-green-700 font-medium mb-4">
                Languages I Speak (max. 3):
              </h3>
              {spokenLanguages.map((entry, index) => (
                <LanguageSelector
                  key={index}
                  value={entry}
                  onChange={(val) =>
                    setSpokenLanguages((prev) =>
                      prev.map((item, i) => (i === index ? val : item))
                    )
                  }
                  onRemove={() =>
                    setSpokenLanguages((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                />
              ))}
              {spokenLanguages.length < MAX_LANGUAGES && (
                <button
                  type="button"
                  className="bg-white hover:bg-green-50 text-green-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow"
                  onClick={() =>
                    setSpokenLanguages((prev) => [
                      ...prev,
                      { language: null, level: "" },
                    ])
                  }
                >
                  + add language
                </button>
              )}
            </div>
            <div>
              <div className="mb-6">
                <h3 className="text-green-700 font-medium mb-4">
                  Languages I Want to Learn (max. 3):
                </h3>
                {learningLanguages.map((entry, index) => (
                  <LanguageSelector
                    key={index}
                    value={entry}
                    onChange={(val) =>
                      setLearningLanguages((prev) =>
                        prev.map((item, i) => (i === index ? val : item))
                      )
                    }
                    onRemove={() =>
                      setLearningLanguages((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                  />
                ))}
                {learningLanguages.length < MAX_LANGUAGES && (
                  <button
                    type="button"
                    className="bg-white hover:bg-green-50 text-green-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow"
                    onClick={() =>
                      setLearningLanguages((prev) => [
                        ...prev,
                        { language: null, level: "" },
                      ])
                    }
                  >
                    + add language
                  </button>
                )}
                {errorMessage && (
                  <p className="text-red-600 font-semibold text-center mt-4">
                    {errorMessage}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="flex-1 bg-white p-6 rounded-lg shadow-lg">
            <div className="mb-4">
              <label className="block text-green-700 font-medium mb-2">
                Profile Picture
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/jpeg, image/png"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-green-500 file:text-white
                  hover:file:bg-green-600"
              />
            </div>

            <div className="mt-4 border-2 border-dashed border-green-300 rounded-lg h-48 flex items-center justify-center bg-green-50">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-green-500">Image preview</span>
              )}
            </div>

            <div className="mt-6">
              <label
                htmlFor="about"
                className="block text-green-700 font-medium mb-2"
              >
                About me
              </label>
              <textarea
                maxLength={600}
                id="about"
                name="about"
                required
                placeholder="Write something about yourself, your interests, and what you are looking for in a tandem partner (ca. 100 words)."
                onChange={handleChange}
                defaultValue={user?.about || ""}
                className="w-full p-2 border border-green-300 rounded h-78"
              />
            </div>
          </section>
        </div>

        <div className="text-center mt-8">
          <button
            type="submit"
            disabled={isUploading}
            className={`bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-200 ${
              isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isUploading
              ? "Saving..."
              : isEditing
              ? "Save changes / Back to dashboard "
              : "Create Profile"}
          </button>
          {errorMessage && (
            <p className="text-red-600 font-semibold text-center mt-4">
              {errorMessage}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateProfile;
