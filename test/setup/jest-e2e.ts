import config from "./jest-setup";

export default {
  ...config,
  testRegex: ".e2e-spec.ts$",
};
