import theme from "@nuxt/content-theme-docs";

export default theme({
  env: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  },
  router: {
    base: process.env.DEPLOY_ENV === "GH_PAGES" ? "/omc-app" : "/",
  },
  pwa: {
    manifest: {
      name: "OMC App Docs",
    },
  },
});
