import theme from "@nuxt/content-theme-docs";

export default theme({
  env: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN
  },
  loading: { color: "#ff4785" },
  router: {
    base: process.env.DEPLOY_ENV === "GH_PAGES" ? "/omc-app" : "/"
  }
});
