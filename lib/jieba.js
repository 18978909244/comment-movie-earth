const nodejieba = require('nodejieba')
const fs = require('fs')
const fn = require('./fn')


module.exports = async (comments, number = 10) => {
    let result = nodejieba.extract(comments, number)
    let text = ``
    for (let i = 0; i < result.length; i++) {
        let weight = 3
        if (i < number * 1 / 100) {
            weight = 6
        } else if (i < number * 3 / 100) {
            weight = 5
        } else if (i < number * 10 / 100) {
            weight = 4
        } else {
            weight = 3
        }
        let randomColor = fn.randomColor()
        text += `${weight}|${result[i].word}|${randomColor}|1|是\n`
    }
    await fs.writeFileSync('./output/result.txt', text, 'utf-8')
}