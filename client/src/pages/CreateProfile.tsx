import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import languageData from "../data/languages.json";

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
console.log("Language Options:", languageOptions);

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const hasValidSpoken = spokenLanguages.some(
      (entry) => entry.language !== null
    );
    const hasValidLearning = learningLanguages.some(
      (entry) => entry.language !== null
    );

    if (!hasValidSpoken || !hasValidLearning) {
      setErrorMessage(
        "Please select at least one language you speak and one language you want to learn."
      );
      return;
    }

    setErrorMessage(null);

    const formattedSpoken = spokenLanguages.map((l) => ({
      code: l.language?.value,
      name: l.language?.label,
      level: l.level,
    }));

    const formattedLearning = learningLanguages.map((l) => ({
      code: l.language?.value,
      name: l.language?.label,
      level: l.level,
    }));

    console.log({ formattedSpoken, formattedLearning });
  };

  const handleChange = () => {
    console.log("change");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6">
      <h2 className="text-4xl text-green-700 font-bold italic text-center mb-12">
        CREATE PROFILE
      </h2>

      {/* Left Section */}

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
                className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Birthday */}
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
                  className="w-1/3 p-2 border border-green-300 rounded"
                />
              </div>
            </div>

            {/* Choose Gender Identity */}
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
                    />
                    <span className="ml-2 text-green-700 capitalize">
                      {gender}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Gender Interest */}
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
                    />
                    <span className="ml-2 text-green-700 capitalize">
                      {interest === "everyone" ? "Everyone" : interest}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Language knowledge and lang interest */}

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

          {/* Right Section */}
          <section className="flex-1 bg-white p-6 rounded-lg shadow-lg">
            <div className="mb-4">
              <label
                htmlFor="url"
                className="block text-green-700 font-medium mb-2"
              >
                Profile photo URL
              </label>
              <input
                type="url"
                name="url"
                id="url"
                onChange={handleChange}
                required
                className="w-full p-2 border border-green-300 rounded"
              />
            </div>

            {/* Image Preview Placeholder */}
            <div className="mt-4 border-2 border-dashed border-green-300 rounded-lg h-48 flex items-center justify-center bg-green-50">
              <span className="text-green-500">Image preview</span>
            </div>

            {/* About Me */}
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
                className="w-full p-2 border border-green-300 rounded h-78"
              />
            </div>
          </section>
        </div>

        {/* Submit Button */}
        <div className="text-center mt-8">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-200"
          >
            Create Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProfile;
