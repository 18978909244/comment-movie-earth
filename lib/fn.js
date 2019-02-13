
const cheerio = require('cheerio')

const handleHtml = html => {
    let $ = cheerio.load(html)
    let commentItems = $('#comments').find('.comment-item')
    let commentList = []
    commentItems.each(function () {
        let commentItem = $(this).find('.short').text()
        commentList.push(commentItem)
    })
    return commentList
}
const sleep = time => new Promise(resolve => setTimeout(resolve, time * 1000))
const handlerPromise = async (promise) => {
    try {
        let data = await promise
        return [null, data]
    } catch (e) {
        return [e, null]
    }
}

const randomColor = () => {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    let color = '#' + r.toString(16) + g.toString(16) + b.toString(16);
    return color;
}
module.exports = {
    handleHtml,
    sleep,
    handlerPromise,
    randomColor
}