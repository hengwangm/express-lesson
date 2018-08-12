var express = require('express');
var router = express.Router();
var axios = require('axios')
var cheerio = require('cheerio');
var db = require("../config/db");

/* 获取武汉留言板的洪山区信息 */
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.common['Referer'] = 'http://liuyan.cjn.cn/threads/list?fid=12';

router.get('/', async function(req, res, next) {
 const arr=[];
 let id=0;
 for (const n of new Array(10)) {
  const data = await getList(id)
  id = await data[data.length-1].id;
  arr.push(...data);
  console.log(id);
  } 
  //入库
 /*  arr.forEach( d=>{
    db.query("insert into info(id,request,response) values('"+ d.id +"','"+ d.content +"','"+d.asContent+"')",
      function(err,rows){
        if(err){
          console.error(err);
        }

      });
  }) */
  res.render('index', { arr: arr, title: 'Hello there!'});
});


async function getList(lastTid = 0){
   return axios.post('http://liuyan.cjn.cn/threads/queryThreadsList?fid=12&state=4&lastTid='+lastTid).then(function(response){
    /*  var $=cheerio.load(response.data);//用cheerio解析页面数据*/
    let datas=[];
    const data = response.data;
    if(data.result){
      const responseData = data.responseData;
      responseData.forEach(da => {
        const obj={
          id:da.threads.tid,
          content : da.threads.content,
          asContent : da.newestAnswer.asContent
        }
        datas.push(obj);
      });
      return datas;
    }
  })
}

module.exports = router;
