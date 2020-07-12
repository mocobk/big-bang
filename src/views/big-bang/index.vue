<template>
    <div class="container">
        <div class="content">
            <div class="header">
                <van-button round color="rgb(32, 32, 32)" @click="showDialog">粘 贴</van-button>
                <van-button round color="rgb(32, 32, 32)" @click="selectAll">全 选</van-button>
                <van-button round color="rgb(32, 32, 32)" @click="inverseSelection">反 选</van-button>
                <van-button round color="rgb(32, 32, 32)" @click="unselectAll">取 消</van-button>

            </div>
            <div v-mo-loading="loading" mo-loading-background="rgb(93, 94, 96)">
                <div class="main">
                    <van-tag
                        v-for="(item, index) in items"
                        :key="index"
                        size="large"
                        :class="{'tag-selected': item.selected, 'tag-unselected': !item.selected}"
                        :number="index"
                        @touchstart="onTouchStart"
                        @touchmove.prevent="onTouchMove"
                        v-on-single-tap="onClick"
                        v-on-double-tap="onDoubleClick"

                    >
                        {{item.word}}
                    </van-tag>

                </div>
            </div>

            <div class="footer">
                <van-button v-show="selectedItems.length > 0" round color="rgb(32, 32, 32)" @click="copyText">复 制
                </van-button>

            </div>
        </div>

        <van-dialog v-model="dialogShow" title="粘贴文本" @confirm="text=textareaValue" show-cancel-button>
            <label style="margin: .8rem; display: block">
                    <textarea
                        id="paste-textarea"
                        ref="textarea"
                        v-model="textareaValue"
                        autocomplete="off"
                        placeholder="请粘贴要爆炸的文本"
                        rows="5"
                        style="width: 100%; border: none">
                    </textarea>
            </label>
        </van-dialog>


    </div>

</template>

<script>
    import handleClipboard from '@/utils/clipboard'
    import {getSplitWords} from '@/api/big-bang'

    export default {
        name: 'BigBang',
        data() {
            return {
                textareaValue: '',
                text: '',
                words: [],
                items: [],
                moveFirstIndex: 0,
                movePreviousIndex: 0,
                selectMode: false,
                dialogShow: false,
                isMounted: false,
                loading: false,

            }
        },
        computed: {
            selectedItems() {
                return this.items.filter(item => item.selected)
            },
        },
        mounted() {
            this.isMounted = true
        },
        created() {
            if (this.$route.query.text) {
                this.text = this.$route.query.text
            }
        },
        watch: {
            text(newValue) {
                this.setWords(newValue)
            }
        },
        methods: {
            showDialog() {
                this.textareaValue = ''
                this.dialogShow = true
                new Promise(resolve => {
                    let interval = setInterval(() => {
                        if (this.$refs.textarea) {
                            clearInterval(interval)
                            resolve()
                        }
                    }, 200)
                }).then(() => {
                    this.$refs.textarea.focus()
                })

            },
            setWords(text) {
                this.loading = true
                getSplitWords(text).then(res => {
                    this.words = res.words
                    this.items = this.generateItems()
                    this.loading = false
                })
            },
            generateItems() {
                return this.words.map((item) => {
                    return {word: item, selected: false}
                })
            },

            getItemByElement(element) {
                return this.items[element.getAttribute('number')]
            },
            getElementIndex(element) {
                return Number(element.getAttribute('number'))
            },

            isSelect(curIndex) {
                /**
                 * 选择模式下： 整体和局部都向前或向后滑动， 对元素进行选择操作
                 * 取消模式下： 整体和局部不都向前或向后滑动， 对元素进行选择操作
                 * 其他都是取消操作
                 * */
                if (curIndex === this.movePreviousIndex) {
                    return this.selectMode
                }
                const isWholeMoveForward = curIndex - this.moveFirstIndex > 0
                const isPartMoveForward = curIndex - this.movePreviousIndex > 0
                return (((isWholeMoveForward && isPartMoveForward) || (!isWholeMoveForward && !isPartMoveForward)) && this.selectMode) || (isWholeMoveForward + isPartMoveForward === 1 && !this.selectMode)
            },

            onClick(event) {
                const index = this.getElementIndex(event.target)
                this.items[index].selected = !this.items[index].selected
            },

            onDoubleClick(event) {
                const index = this.getElementIndex(event.target)
                const item = this.items[index]
                if (item.word.length < 2) {
                    return
                }
                const newItems = item.word.split('').map(item=>{
                    return {word: item, selected: this.items[index].selected}
                })
                const splitItems = this.items.splice(index)
                this.items = [...this.items, ...newItems, ...splitItems.slice(1)]
            },

            onTouchStart(event) {
                const item = this.getItemByElement(event.target)
                this.selectMode = !item.selected
                this.moveFirstIndex = this.getElementIndex(event.target)
                this.movePreviousIndex = this.moveFirstIndex
            },
            onTouchMove(event) {
                const {clientX, clientY} = event.targetTouches[0]
                const touchElement = document.elementFromPoint(clientX, clientY)
                if (touchElement.hasAttribute('number')) {
                    const curIndex = this.getElementIndex(touchElement)
                    const [start, end] = curIndex > this.movePreviousIndex ? [this.movePreviousIndex, curIndex] : [curIndex, this.movePreviousIndex]
                    for (let i = start; i <= end; i++) {
                        this.items[i].selected = this.isSelect(curIndex)
                    }
                    this.movePreviousIndex = curIndex

                }
            },
            setAllValue(value) {
                for (let i=0; i<this.items.length; i++){
                    this.items[i].selected = value
                }
            },
            selectAll() {
                this.setAllValue(true)
            },
            inverseSelection() {
                for (let i=0; i<this.items.length; i++){
                    this.items[i].selected = !this.items[i].selected
                }
            },
            unselectAll() {
                this.setAllValue(false)
            },
            copyText(event) {
                const text = this.selectedItems
                    .map(item => item.word)
                    .join('')
                if (text === '') {
                    this.$toast.fail('复制内容为空')
                    return
                }
                handleClipboard(
                    text,
                    event,
                    () => {
                        this.$toast.success('复制成功')
                    },
                    () => {
                        this.$toast.fail('复制失败')
                    },
                )
            },


        }
    }
</script>

<style scoped lang="scss">
    .container {
        background-color: rgb(93, 94, 96);
        display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100vh;

        .content {
            width: 100%;

            .van-button {
                margin: 0 0.5rem;
                width: 4.5rem;
                height: 2rem;
            }

            .header {
                text-align: center;
            }

            .main {
                margin: 4.5vh 0.35rem;
                padding: 0 0.35rem;
                max-height: 55vh;
                min-height: 30vh;
                overflow-y: auto;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                align-content: flex-start;
                /*实现最后一行不要两端对齐，如最后一行只剩两个时不好看*/
                &:after {
                    content: "";
                    flex: auto;
                }

                .van-tag {
                    margin: 0.35rem;
                    line-height: 1.5rem;
                }

                .tag-selected {
                    background-color: #F56C6C;
                    color: white;
                }

                .tag-unselected {
                    background-color: white;
                    color: black;
                }
            }

            .footer {
                text-align: center;
                height: 2rem;
            }
        }

        .van-loading {
            z-index: 1;
            position: absolute;
            text-align: center;
        }
    }

</style>
