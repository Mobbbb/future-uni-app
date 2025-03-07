import path from 'path'
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import inject from '@rollup/plugin-inject'

const uxMessage = path.resolve(__dirname, './utils/ux-message.js')
 
export default defineConfig({
	plugins: [
		uni(),
		inject({
			ElMessage: [uxMessage, 'ElMessage'],
		}),
	],
	server: {
		proxy: {
			'/api': {
				target: 'https://www.mobbbb.top', // 目标服务
				changeOrigin: true,
			},
			// '/api/future': {
			// 	target: 'http://127.0.0.1:3002', // 目标服务
			// 	changeOrigin: true,
			// 	rewrite: path => path.replace(/^\/api\/future/, ''),
			// },
			'/resource': {
				target: 'https://www.mobbbb.top', // 目标服务
				changeOrigin: true,
			}
		}
	},
})