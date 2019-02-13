> 写这个的背景是这两天看到新闻，《流浪地球》的死忠粉因为豆瓣电影上出现了太多的低分评价，有人在豆瓣雇水军给这部电影故意打一星，豆瓣却不管！据说《流浪地球》一开始有 8.5 分，结果一路下滑到如今的7.9 分。

最近知道一件事，是说流浪地球的死忠粉因为豆瓣电影上出现了太多的低分评价，有人在豆瓣雇水军给这部电影故意打一星，豆瓣却不管！

结果正因为这部电影，短短几天，豆瓣 App 可倒了血霉，评分从 4.3 一路下滑到不到 1.5 分。豆瓣电影 App 的评分更惨，直接掉到了 1.3 分。这些给豆瓣 App 打一星的大部分都是怨愤满满的《 流浪地球 》粉丝。

这件事让我想尝试豆瓣上抓取下用户的评价，看看这部电影影评的关键词。也是因为网络上经常有python的开发者喜欢到各个网站里抓取数据作分析（其实都是装逼）。

进入正题开始干活吧：

先从豆瓣电影进去，第一眼就看到《流浪地球》。

![image](https://tennis.kuashou.com/mmbiz_png/Mrt1ShKHR9Kt1u0CFaVn8NDgsGYUclEonDiavJ7KHLFOE5F56JibB4icKyffLJttDfq4qu8poF4T8aK9Mo3fEsJwg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

据说《流浪地球》一开始有 8.5 分，结果一路下滑到如今的7.9 分

点击后，拖到中间，可以看到有30多万的短评

![image](https://tennis.kuashou.com/mmbiz_png/Mrt1ShKHR9Kt1u0CFaVn8NDgsGYUclEoHU7XZZe84vKEEYLzmIW317qlB1IdWYsjI6fcdWgY2HgvT8BovnXv7g/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

我们就以这30多万的短评作为我们要的数据源

点击之后，简单的点击上下页和各种筛选，可以找到对应的请求链接

[https://movie.douban.com/subject/26266893/comments?start=20&limit=20&sort=new_score](https://movie.douban.com/subject/26266893/comments?start=20&limit=20&sort=new_score)

- start --> 偏移量
- limit --> 每次请求短评数量
- sort --> 排序 new_score热门 time最新

于是写出一个得到数据的一个函数, 这里用了axios请求库和Node内置的util库

```js
const axios = require('axios')
const util = require('util')

const defaultURL = 'https://movie.douban.com/subject/26266893/comments?start=%s&limit=%s&sort=%s&percent_type=%s'
//%s是占位符，用函数传参返回也可以

async ()=>{
    let endPage = 5 //爬到第几页
    let pageNumber = 20 //每页多少条
    let allCommentsList = []
    for(let i = 0; i < endPage; i++){
        let url = util.format(defaultURL,i*pageNumber,pageNumber,sort) //构造url
        let html = axios.get(url).then(res=>res.data)
        // 获取该页返回的html
        let commentItem = handlerHtml(html)
        // 得到该页返回的短评返回数组
        
        allCommentsList = [...allCommentsList,...commentItem]
        // 遍历合并评价数组
    }
    //  ... 略 handleComments(allCommentsList) 这时可以返回所有的短评allCommentsList
}
```

其中的handlerHtml函数使用了cheerio来获取html的评价数据，类jQuery语法

```js
const cheerio = require('cheerio')
const handlerHtml = html =>{
    let $ = cheerio.load(html)
    let commentItems = $('#comments').find('.comment-item')
    let commentList = []
    commentItems.each(function(){
        let commentItem = $(this).find('.shor').text()
        commentList.push(commentItem)
    })
    return commentList
}
```

拿到所有的短评数组后，我们要开始进行分词，使用了nodejieba这个分词库：

```js
const nodejieba = require('nodejieba')
let result = nodejieba.extract(allCommentsList, 200) //取前200个关键词
```

打印result可以得到我们要的结果

```json
{ word: '科幻', weight: 1308.1601062352 },
{ word: '地球', weight: 742.19933366644 },
{ word: '电影', weight: 672.44585264718 },
{ word: '科幻片', weight: 652.9053335283 },
{ word: '特效', weight: 546.42240383248 },
{ word: '科幻电影', weight: 525.6040982178 },
{ word: '流浪', weight: 490.83323603608 },
{ word: '吴京', weight: 444.821684864 },
{ word: '中国', weight: 408.6882926991 },
{ word: '煽情', weight: 389.48311253950004 }
```

把最后的结果我再处理了一下找了一个在线生成词云的网站制作出来就是这样，其中混入了一些无关紧要的词就不另做过滤处理了。

![image](https://tennis.kuashou.com/mmbiz_png/Mrt1ShKHR9Kt1u0CFaVn8NDgsGYUclEolmsYDiaVW2B2rqdLxco4kbPGX0H54dssEyQI6HLdGvrcrUzq9hoCH0w/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)