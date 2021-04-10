import { withDocus } from 'docus'

export default withDocus({
  srcDir: 'src/',
  docus: {
    colors: {
      primary: '#8E75FF',
    },
  },
  router: {
    base: '/omc-app/',
  },
  /* Workaround for subdirectory routing breaking anchors.
   *
   * @see https://github.com/nuxt/content/issues/376
   */
  hooks: {
    'vue-renderer:ssr:templateParams': function (params) {
      params.HEAD = params.HEAD.replace('<base href="/omc-app/">', '')
    },
  },
})
