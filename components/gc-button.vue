<template>
    <div class="gc-button" :class="btnClass" :style="style" @click="clickHandle">
		<uni-icons class="gc-button-icon loading-icon" v-if="loading" type="spinner-cycle" size="30"></uni-icons>
        <slot></slot>
    </div>
</template>

<script>
import { computed, toRefs } from 'vue'

export default {
    name: 'gc-button',
    props: {
        color: {
            type: Object,
            default: () => {
                return {}
            },
        },
        width: {
            type: String,
            default: '71px',
        },
        icon: {
            type: String,
            default: '',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            default: '',
        },
        loading: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { emit }) {
        const { width, disabled, type, loading } = toRefs(props)

        const style = computed(() => {
            return { width: width.value }
        })

        const formatDisabled = computed(() => {
            return disabled.value || loading.value
        })

        const btnClass = computed(() => {
            let _class = formatDisabled.value ? 'gc-button-disabled' : ''
            if (type.value) {
                _class += ` gc-button-${type.value}`
            }
            return _class
        })

        const clickHandle = () => {
            if (!formatDisabled.value) {
                emit('on-click')
            }
        }

        return {
            style,
            btnClass,
            clickHandle,
        }
    },
}
</script>

<style scoped>
.gc-button {
    border: 1px solid #00a1d6;
    color: #00a1d6;
    transition: 0.3s;
    position: relative;
    padding: 0 6px;
    height: 40px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 12px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
	box-sizing: border-box;
}
.gc-button:active {
    color: #fff;
    background: #008fbe;
}
.gc-button-icon {
    margin-right: 5px;
}
.loading-icon {
    animation: rotating 2s linear infinite;
}

.gc-button-danger {
    border: 1px solid #f23c3c;
    color: white;
    background: #f23c3c;
}
.gc-button-danger:active {
    border: 1px solid #f23c3c;
    color: white;
    background: #f23c3c;
}

.gc-button-wx {
    border: 1px solid #1aad19;
    color: white;
    background: #1aad19;
}
.gc-button-wx:active {
    border: 1px solid #179b16;
    color: white;
    background: #179b16;
}

.gc-button-active {
    background: #00a1d6;
    color: white!important; /* wx按钮颜色bug */
}

.gc-button-disabled {
    color: #c0c4cc!important;
    cursor: not-allowed;
    border-color: #e4e7ed;
    background-color: white;
}
.gc-button-disabled:active {
    border-color: #e4e7ed;
    background-color: white;
}
</style>
