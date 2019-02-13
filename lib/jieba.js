const nodejieba = require('nodejieba')
const fs = require('fs')
const fn = require('./fn')


module.exports = async (comments, number = 10) => {
    let result = nodejieba.extract(comments, number)
    let text = ``
    for (let i = 0; i < result.length; i++) {
        let weight = 1
        if (i < number * 1 / 10) {
            weight = 10
        } else if (i < number * 2 / 10) {
            weight = 9
        } else if (i < number * 3 / 10) {
            weight = 8
        } else if (i < number * 4 / 10) {
            weight = 7
        } else if (i < number * 5 / 10) {
            weight = 6
        } else if (i < number * 6 / 10) {
            weight = 5
        } else if (i < number * 7 / 10) {
            weight = 4
        } else if (i < number * 8 / 10) {
            weight = 3
        } else if (i < number * 9 / 10) {
            weight = 2
        } else {
            weight = 1
        }
        let randomColor = fn.randomColor()
        text += `${weight}|${result[i].word}|${randomColor}|1|是\n`
    }
    await fs.writeFileSync('./output/result.txt', text, 'utf-8')
}