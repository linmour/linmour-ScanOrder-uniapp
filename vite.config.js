import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
  ],
  transpileDependencies: ['@dcloudio/uni-ui']
})
//
// // vue.config.js
// const path =require('path')
// const themePath = path.resolve(__dirname,'./src/style/theme.less')
// module.exports = {
//   css: {
//     loaderOptions: {
//       less: {
//         // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
//         lessOptions: {
//           modifyVars: {
//             // 直接覆盖变量
//             'text-color': '#111',
//             'border-color': '#eee',
//             // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
//             hack: `true; @import "src/style/theme.less";`,
//           },
//         },
//       },
//     },
//   },
// };
