
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
 
export default defineConfig({
	plugins: [
		uni()
	],
	server: {
		proxy: {
			'/api': {
				target: 'https://www.mobbbb.top', // 目标服务  
				changeOrigin: true,
				// rewrite: path => path.replace(/^\/api/, ''),
			},
			'/resource': {
				target: 'https://www.mobbbb.top', // 目标服务  
				changeOrigin: true,
				// rewrite: path => path.replace(/^\/api/, ''),
			}
		}
	},
})