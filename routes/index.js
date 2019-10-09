/**
 * Created by Administrator on 2018/3/20 0020.
 */

var router=require('koa-router')();
const path=require('path');
const body = require('koa-body');
const fs =require('fs');
const dirhelper = require('./../util/DirectoryHelper.js');
const conf = require('./../util/config.js');

var urlencode = require('urlencode');
var mime = require('mime')
var datefrm = require('../util/datefrm')

router.get('/',async (ctx)=>{
    ctx.body='home'
        //await ctx.render('default/index');
})
//注意 前台后后台匹配路由的写法不一样
router.get('/case',(ctx)=>{

    ctx.body='案例'
})

router.get('/download',async (ctx)=>{
    let req = ctx.req
    let res = ctx.res
    
    res.setTimeout(0);
    res.connection.setTimeout(0);
    req.connection.setKeepAlive(true,60*1000*60*24);
    res.connection.setKeepAlive(true, 60*1000*60*24);
    //req.setSocketKeepAlive(true);
    
    //console.log(ctx);
    if ( ctx.query.root )
        var rootdir = conf.rootDirection[ ctx.query.root ]
    else
        var rootdir = path.join(__dirname, '../statics/upload' );
    
    
    var serchstr ='upload/'
    var pathname = ctx.query.file;
    pathname = urlencode.decode(pathname); 

  
    if ( pathname.indexOf( serchstr )>-1 ){
        let start = pathname.indexOf( serchstr ) + serchstr.length
        pathname = pathname.substring(start );
    }

    var p = path.join(rootdir, pathname);
   

   // console.log('p:', p)
    
    let statObj =  fs.statSync(p)
  //  console.log(statObj)

    let start = 0;
    //let end = 0;
    let end = statObj.size - 1; // 读流是包前又包后的
    let total = statObj.size;
    let range = req.headers['range'];

    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Connection','keep-alive');

    if (range) {

        console.log(`${ datefrm.frmdate(  new Date(),'yyyy-MM-dd hh:mm:ss')}=====${range}`   );

        res.statusCode = 206;
        let result = range.match(/bytes=(\d*)-(\d*)/);
        start = result[1] ? parseInt(result[1]) : start;
        end = result[2] ? parseInt(result[2]): end; // 因为流的 end 是 包前又包后的 此次这个地方需要减去 1 
       
        if (end <0){
            end =0
        }
        
        if ( end >=total ){
            end = total -1 ;
        }

        if ( start >end)
            return ctx.body="fail";

    }

    // 告知客户端获取成功
    res.setHeader('Content-Range', `bytes ${start}-${end}/${total}`);

    //res.setHeader('Content-Type', 'text/plain;charset=utf8');
    let rdfile= fs.createReadStream(p, { start, end });


    filename = path.basename(pathname) ;//+'.'+ path.extname( pathname);

    console.log( `${ datefrm.frmdate(  new Date(),'yyyy-MM-dd hh:mm:ss') } =======${filename} : ${end-start+1} `  )
 
    var contentType= mime.getType(filename);
    filename = urlencode.encode(filename);

    if (contentType)
        ctx.set('Content-Type', contentType);
    else
        ctx.set('Content-Type', 'application/octet-stream');
    
    //console.log(contentType)

    ctx.set('Content-Disposition', 'attachment; filename=' + filename);
    ctx.set('Content-Length', end -start +1 );
    return ctx.body = rdfile;

    //ctx.body ="ok";

})




module.exports=router.routes();