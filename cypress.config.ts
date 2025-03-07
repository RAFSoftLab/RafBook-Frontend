import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'ag7sb3',
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: 'cypress/fixtures',
    specPattern: 'cypress/e2e/**/*.{spec,cy}.{js,jsx,ts,tsx}',
    video: false,
    experimentalOriginDependencies: true,
  },
});
