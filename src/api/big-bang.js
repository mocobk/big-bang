import request from '@/utils/request'

export function getSplitWords(text) {
    return request({
            url: '/tools/big-bang',
            method: 'get',
            params: {text}
        }
    )
}
