<template>
    <view class="avatar-item-wrap" @click="onClick">
        <img class="avatar-img" :class="imgClass" :src="imgSrc">
        <text :style="isCached ? { color: 'var(--base-text-color)', fontWeight: 'bold', } : {}">{{name}}</text>
    </view>
</template>

<script>
export default {
    props: ['name', 'imgClass', 'imgSrc', 'isCached'],
    data() {
        return {

        }
    },
	methods: {
		onClick() {
			this.$emit('on-click')
		},
	},
}
</script>

<style>
.cache-icon {
    width: 6px;
    height: 6px;
    background: red;
    position: absolute;
    right: 6px;
    top: 6px;
    border-radius: 50%;
}
</style>
