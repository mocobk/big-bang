import Vue from 'vue';
import LoadingComponent from './loading';
const LoadingConstructor = Vue.extend(LoadingComponent);

export default() => {
    Vue.directive('mo-loading', {
        /**
         * 只调用一次；指令第一次绑定到元素时调用，可用于初始化设置
         * @param {*} el 指令绑定的元素
         * @param {*} binding 指令传入的信息{ name: '指令名称', value: '指令绑定的值', arg: 'v-bind:text 对应的text' }
         */
        bind(el, binding) {
            const text = el.getAttribute('mo-loading-text');
            const background = el.getAttribute('mo-loading-background');
            const textColor = el.getAttribute('mo-loading-text-color');
    
            const instance = new LoadingConstructor({
                el: document.createElement('div'),
                data: {text, background, textColor},
            })
            el.appendChild(instance.$el)
            el.instance = instance
            Vue.nextTick(() => {
                el.style.setProperty('position', 'relative', 'important')
                el.instance.$el.style.setProperty('position', 'absolute', 'important')
                el.instance.visible = binding.value
            })
        },
        /**
         * 组件的VNode更新时调用
         * @param {*} el
         * @param {*} binding
         */
        update(el, binding) {
            if (binding.oldValue !== binding.value) {
                el.instance.visible = binding.value
            }
        },
        /**
         * 只调用一次；指令与元素解绑是调用
         * @param {*} el
         */
        unbind(el) {
            const loading = el.instance.$el
            if (loading.parentNode) {
                loading.parentNode.removeChild(loading)
            }
            el.instance.$destroy()
            el.instance = undefined
        }
    })
}
