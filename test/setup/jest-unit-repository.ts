import config from "./jest-unit";

export default {
  ...config,
  testRegex: ".*\\.repository\\.spec\\.ts$",
  testPathIgnorePatterns: [],
};
