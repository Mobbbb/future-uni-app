<template>
	<view class="ux-icon" :class="props.type" :style="style"></view>
</template>

<script setup>
import { computed, toRefs, defineProps } from 'vue'

const props = defineProps({
	type: {
		type: String,
		default: 'left',
	},
	size: {
		type: String,
		default: '16',
	},
	left: {
		type: String,
		default: '0',
	},
	right: {
		type: String,
		default: '0',
	},
})

const style = computed(() => ({
	fontSize: `${props.size}px`,
	margin: `0 ${props.right}px 0 ${props.left}px`,
}))
</script>

<style scoped lang="scss">
.ux-icon {
	height: 1em;
	width: 1em;
	background-repeat: no-repeat;
	background-size: 100%;
}

.left {
	background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjxzdmcgIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgICA8cGF0aCBmaWxsPSIjZGNkZmU2IiANCiAgICBkPSJNNTI5LjQwOCAxNDkuMzc2YTI5LjEyIDI5LjEyIDAgMCAxIDQxLjcyOCAwIDMwLjU5MiAzMC41OTIgMCAwIDEgMCA0Mi42ODhMMjU5LjI2NCA1MTEuOTM2bDMxMS44NzIgMzE5LjkzNmEzMC41OTIgMzAuNTkyIDAgMCAxLS41MTIgNDMuMjY0IDI5LjEyIDI5LjEyIDAgMCAxLTQxLjIxNi0uNTEyTDE5Ny43NiA1MzQuMjcyYTMyIDMyIDAgMCAxIDAtNDQuNjcybDMzMS42NDgtMzQwLjIyNHptMjU2IDBhMjkuMTIgMjkuMTIgMCAwIDEgNDEuNzI4IDAgMzAuNTkyIDMwLjU5MiAwIDAgMSAwIDQyLjY4OEw1MTUuMjY0IDUxMS45MzZsMzExLjg3MiAzMTkuOTM2YTMwLjU5MiAzMC41OTIgMCAwIDEtLjUxMiA0My4yNjQgMjkuMTIgMjkuMTIgMCAwIDEtNDEuMjE2LS41MTJMNDUzLjc2IDUzNC4yNzJhMzIgMzIgMCAwIDEgMC00NC42NzJsMzMxLjY0OC0zNDAuMjI0eiI+PC9wYXRoPg0KPC9zdmc+');
}

.right {
	background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjxzdmcgIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiA8cGF0aCBmaWxsPSIjZGNkZmU2IiBkPSJNNDUyLjg2NCAxNDkuMzEyYTI5LjEyIDI5LjEyIDAgMCAxIDQxLjcyOC4wNjRMODI2LjI0IDQ4OS42NjRhMzIgMzIgMCAwIDEgMCA0NC42NzJMNDk0LjU5MiA4NzQuNjI0YTI5LjEyIDI5LjEyIDAgMCAxLTQxLjcyOCAwIDMwLjU5MiAzMC41OTIgMCAwIDEgMC00Mi43NTJMNzY0LjczNiA1MTIgNDUyLjg2NCAxOTJhMzAuNTkyIDMwLjU5MiAwIDAgMSAwLTQyLjY4OHptLTI1NiAwYTI5LjEyIDI5LjEyIDAgMCAxIDQxLjcyOC4wNjRMNTcwLjI0IDQ4OS42NjRhMzIgMzIgMCAwIDEgMCA0NC42NzJMMjM4LjU5MiA4NzQuNjI0YTI5LjEyIDI5LjEyIDAgMCAxLTQxLjcyOCAwIDMwLjU5MiAzMC41OTIgMCAwIDEgMC00Mi43NTJMNTA4LjczNiA1MTIgMTk2Ljg2NCAxOTJhMzAuNTkyIDMwLjU5MiAwIDAgMSAwLTQyLjY4OHoiPjwvcGF0aD4NCgkJDQo8L3N2Zz4=');
}
</style>
