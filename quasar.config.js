import { defineConfig } from '#q-app/wrappers'

export default defineConfig((/* ctx */) => ({
  boot: ['pinia'],
  css: ['app.scss'],
  extras: ['roboto-font', 'material-icons'],
  build: {
    // Hash mode avoids blank screens on static hosts
    // (no special server rewrite rules needed for deep links).
    vueRouterMode: 'hash',
    vitePlugins: [],
  },
  devServer: { open: true },
  framework: {
    plugins: ['Dark', 'Notify', 'Dialog'],
  },
  animations: [],
}))
