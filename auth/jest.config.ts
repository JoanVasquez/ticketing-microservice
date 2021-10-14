module.exports = {
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "node",
  collectCoverage: true,
  coveragePathIgnorePatterns: ["/node_modules/", "/build/", "/coverage/"],
  setupFilesAfterEnv: ["./jest.setup.ts"],
  transformIgnorePatterns: [
    "node_modules/(?!(mapboxgl|@mapbox/mapbox-gl-draw)/)",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
