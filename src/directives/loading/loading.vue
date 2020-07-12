<template>
    <transition name="u-loading-fade">
        <div v-show="visible" class="u-loading-mask" :style="{background: background}">
            <div class="u-loading-spinner">
                <van-loading type="spinner" />
                <p v-if="text" class="u-loading-text" :style="{color: textColor}">{{ text }}</p>
            </div>
        </div>
    </transition>
</template>
<script>
    export default {
        data() {
            return {
                visible: true,
                text: '',
                background: 'rgba(0, 0, 0, 0.8)',
                textColor: '#dcdcdc'
            }
        }
    }
</script>
<style lang="scss" scoped>
    .u-loading-mask {
        position: fixed;
        z-index: 999;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        .u-loading-spinner {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .u-loading-text {
            margin-top: 1rem;
        }
    }
</style>
