import config from "./jest-setup";

export default {
  ...config,
  testRegex: ".spec.ts$",
  testPathIgnorePatterns: ["repository.spec.ts", "e2e-spec.ts"],
  coveragePathIgnorePatterns: [
    "node_modules",
    "schemas",
    "dtos",
    "jestGlobalMocks.ts",
    ".module.ts",
    ".mock.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 46,
      functions: 59,
      lines: 70,
      statements: 71,
    },
  },
  modulePathIgnorePatterns: ["<rootDir>/test"],
};
