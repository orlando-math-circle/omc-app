import theme from "@nuxt/content-theme-docs";

export default theme({
  router: {
    base: process.env.DEPLOY_ENV === "GH_PAGES" ? "/omc-app" : "/",
  },
});
