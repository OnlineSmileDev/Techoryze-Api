module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "\\.spec\\.tsx?$",
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx"],
  restoreMocks: true,
  clearMocks: true,
  setupFilesAfterEnv: ["jest-extended"],
  globals: {
    "ts-jest": {
      diagnostics: {
        warnOnly: true,
      },
    },
  },
  coveragePathIgnorePatterns: ["test", "src/middyWrapper"],
};
