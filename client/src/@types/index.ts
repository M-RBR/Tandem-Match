export interface Language {
  code: string;
  name: string;
  level: string;
}
export interface User {
  _id: string;
  email: string;
  first_name: string;
  dob_day: string;
  gender_identity: "man" | "woman" | "diverse";
  gender_interest: "men" | "women" | "everyone";
  spoken_languages: Language[];
  learning_languages: Language[];
  image: string;
  about: string;
  createdAt: string;
  updatedAt?: string; // optional
  matches?: string[]; // optional
}
