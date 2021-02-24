import theme from "@nuxt/content-theme-docs";

export default theme({
  server: {
    port: 4000
  },
  env: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN
  },
  loading: { color: "#ff4785" },
  router: {
    base: process.env.DEPLOY_ENV === "GH_PAGES" ? "/omc-app" : "/"
  }
});
