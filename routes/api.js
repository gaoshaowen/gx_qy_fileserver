/**
 * Created by gaoshaowen on 2018/3/20 0020.
 */
var router=require('koa-router')();
const path=require('path');
const fs =require('fs');
const conf = require('../util/config.js');
var urlencode = require('urlencode');
const execshell = require('../util/execshell')

router.get('/',async (ctx)=>{

    ctx.body={"title":"这是一个api"};
})

router.post('/doUpload', async (ctx)=>{

    //console.log('doUpload path:' + JSON.stringify( ctx.request.files ))

    var search = 'upload/'

   //var rootdir = conf.rootDirection[ conf.currentRoot]
   
    let err_msg =''

    let url ={}

    for(var key in ctx.request.files) 
    {
        let data = ctx.request.files[key]
       
        if ( data instanceof Array ){

            url[key]=[]

            data.forEach( async item =>{

                let addobj ={}

                addobj.name = item.name

                let file_path =item.path 
                let start = file_path.indexOf('upload/');//获得字符串的开始位置
                start =start +search.length
                let result =urlencode.encode(  file_path.substring(start) );//截取字符串

                //addobj.path =  'download?file=' +result + '&root=' + conf.currentRoot 
              // addobj.path =  conf.host +'/download?file=' +result + '&root=' + conf.currentRoot 
               // addobj.path = conf.host +'/upload/' +result
               
               addobj.path = 'upload/' +result

               // let extname= path.extname( file_path).toLowerCase()
                // if (extname !='.pdf' && item.type.indexOf('image')<0 ){

                //     let targname=file_path

                //     try {
                //         targname= await execshell.changepdf( file_path)
                //         result =urlencode.encode(  targname.substring(start) );//截取字符串
                //         //addobj.path =   conf.host +'/download?file=' +result + '&root=' + conf.currentRoot

                //         addobj.path = conf.host +'/upload/' +result

                //         fs.unlink(file_path, (err) => {
                //             if (err) return err;
                //             console.log(file_path,' was deleted');
                //         });

                //         addobj.pdffilename = addobj.name.replace( extname , '.pdf' )

                //     } catch (error) {
                //         err_msg=err_msg+',' + item.name
                //     }
                    
                // }
                // else{
                //     addobj.pdffilename = item.name

                // }
 
                url[key].push(addobj)
           
            })
        }
        else
        {
            let addobj ={}           
            addobj.name = data.name

            let file_path =data.path
            let start = file_path.indexOf('upload/');//获得字符串的开始位置
            start =start +search.length
            let result = urlencode.encode( file_path.substring(start) );//截取字符串
           // addobj.path = conf.host +'/download?file=' +result + '&root=' + conf.currentRoot 

            //addobj.path = conf.host +'/upload/' +result
            addobj.path = 'upload/' +result
            //addobj.path =  'download?file=' +result + '&root=' + conf.currentRoot 
            
            //let extname= path.extname( file_path).toLowerCase()

            // if (extname !='.pdf' && data.type.indexOf('image')<0  ){
            //     let targname =file_path
            //     try {
            //         targname= await execshell.changepdf( file_path)

            //         result = urlencode.encode( targname.substring(start) );//截取字符串
            //         //addobj.path =  conf.host +'/download?file=' +result + '&root=' + conf.currentRoot
            //         addobj.path = conf.host +'/upload/' +result


            //         fs.unlink(file_path, (err) => {
            //             if (err) return err;
            //             console.log(file_path,' was deleted');
            //         });

            //         addobj.pdffilename = addobj.name.replace( extname , '.pdf' )

            //     } catch (error) {
            //         err_msg=err_msg+',' + data.name
            //     }
   
            // }
            // else {
            //     addobj.pdffilename = addobj.name
            // }
           
            url[key] = addobj

        }

    }

    if ( err_msg.length >0 ){

        err_msg = err_msg.substring(1)
        ctx.body ={ "code":1, "msg":"change pdf file fail:" +err_msg , "url":url} 
    }
    else {
        console.log( url )
        ctx.body ={ "code":0, "msg":"上传成功" , "url":url} 
    }

})


router.get('/delfile',async (ctx)=>{
    let req = ctx.req
    let res = ctx.res
    
    console.log(ctx);

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

    var file_path = path.join(rootdir, pathname);
   
    console.log('delete file_path===', file_path)

    
    ctx.body = await ( filepath =>{
        return  new Promise( (resolve, reject) =>{

            fs.unlink(filepath, (err) => {
                if (err)  return  reject ({ code:1, msg:err});
                return resolve( { code:0, msg:'success'} );
            });

        } )

    } )(file_path)

})

module.exports=router.routes();