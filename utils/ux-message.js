export const ElMessage = {
	error: (text) => {
		uni.showToast({
			title: text,
			duration: 2000,
			icon: 'error',
		})
	},
	success: (text) => {
		uni.showToast({
			title: text,
			duration: 2000,
			icon: 'success',
		})
	},
}
