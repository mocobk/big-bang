import Vue from 'vue'
import Clipboard from 'clipboard'

function clipboardSuccess() {
  Vue.prototype.$toast.success('复制成功')
}

function clipboardError() {
  Vue.prototype.$toast.fail('复制失败')

}

function clipboardEmpty() {
  Vue.prototype.$toast.fail('内容为空')
}

export default function handleClipboard(text, event, success=clipboardSuccess, error=clipboardError) {
  if (text === '') {
    clipboardEmpty()
  }
  const clipboard = new Clipboard(document.body, {
    text: () => text
  })
  clipboard.on('success', () => {
    success()
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    error()
    clipboard.destroy()
  })
  // 下面这不能删，不然要点两次才能复制
  clipboard.onClick(event)
}
