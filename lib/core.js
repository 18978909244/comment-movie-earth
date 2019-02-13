const axios = require('axios')
const util = require('util')
const fn = require('./fn')
const jieba = require('./jieba')
const defaultURL = 'https://movie.douban.com/subject/%s/comments?start=%s&limit=%s&sort=new_score'
//%s是占位符，用函数传参返回也可以

let pageNumber = 20 //每页多少条

module.exports = async (movieId = '26266893', endPage = 5, jiebaNumber = 10) => {

    let allCommentsList = []
    for (let i = 0; i < endPage; i++) {
        let url = util.format(defaultURL, movieId, i * pageNumber, pageNumber) //构造url
        let [e, html] = await fn.handlerPromise(axios.get(url).then(res => res.data))
        // 获取该页返回的html
        if (e) {
            continue
        }
        let commentItem = fn.handleHtml(html)
        // 得到该页返回的短评返回数组
        allCommentsList = [...allCommentsList, ...commentItem]
        // 遍历合并评价数组
        await fn.sleep(0.1)

    }
    jieba(allCommentsList, jiebaNumber)
}