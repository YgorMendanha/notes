import en from "./en.json";
import pt from "./pt.json";

export const getDictionary = (locale: "pt" | "en") => {
  if (locale === "pt") {
    return pt;
  }
  return en;
};
