const CreateProfile = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("submitted");
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
                className="block text-green-700 font-medium mb-2"
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
            <div className="mb-4">
              <label className="block text-green-700 font-medium mb-2">
                Birthday
              </label>
              <div className="flex gap-2">
                <input
                  id="dob_day"
                  type="number"
                  name="dob_day"
                  placeholder="DD"
                  required
                  onChange={handleChange}
                  className="w-1/3 p-2 border border-green-300 rounded"
                />
                <input
                  id="dob_month"
                  type="number"
                  name="dob_month"
                  placeholder="MM"
                  required
                  onChange={handleChange}
                  className="w-1/3 p-2 border border-green-300 rounded"
                />
                <input
                  id="dob_year"
                  type="number"
                  name="dob_year"
                  placeholder="YYYY"
                  required
                  onChange={handleChange}
                  className="w-1/3 p-2 border border-green-300 rounded"
                />
              </div>
            </div>

            {/* Choose Gender Identity */}
            <div className="mb-4">
              <label className="block text-green-700 font-medium mb-2">
                Gender
              </label>
              <div className="flex gap-4">
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
                    />
                    <span className="ml-2 text-green-700 capitalize">
                      {gender}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Show Gender Checkbox */}
            <div className="mb-4 flex items-center">
              <input
                id="show-gender"
                type="checkbox"
                name="show_gender"
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="show-gender" className="ml-2 text-green-700">
                Show gender on my profile
              </label>
            </div>

            {/* Gender Interest */}
            <div className="mb-4">
              <label className="block text-green-700 font-medium mb-2">
                Show me
              </label>
              <div className="flex gap-4">
                {["man", "woman", "everyone"].map((interest) => (
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
                    />
                    <span className="ml-2 text-green-700 capitalize">
                      {interest === "everyone" ? "Everyone" : interest}
                    </span>
                  </label>
                ))}
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
              <input
                id="about"
                type="text"
                name="about"
                required
                placeholder="Write something about yourself and your interests."
                onChange={handleChange}
                className="w-full p-2 border border-green-300 rounded h-24"
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
