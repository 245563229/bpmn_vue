// vite.config.js
import { defineConfig } from 'vite'
import path from 'path'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import vue from "@vitejs/plugin-vue";
export default defineConfig(()=>{
  return {
    plugins:[
        vue(),vueSetupExtend()
    ],
    resolve: {
      extensions: ['.js', '.ts', '.json'], // 导入时想要省略的扩展名列表
      alias: {
        '@': path.resolve(__dirname, './src') // 路径别名
      }
    },
    server: {
      proxy: {
        // 选项写法
        '/api': {
          target: 'http:203.652.15:9520',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
      }
    }
  }
})