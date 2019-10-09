(async () => {

    const Koa = require('koa'),
    router = require('koa-router')(),
    render = require('koa-art-template'),
    fs = require('fs'),
    path = require('path');


    const koaBody = require('koa-body');
    const static = require('koa-static')

    //设置静态资源的路径 
    const staticPath = './statics'

    //引入子模块

    var admin = require('./routes/admin.js');
    var api = require('./routes/api.js');
    var index = require('./routes/index.js');

    const dirhelper = require('./util/DirectoryHelper');
    const conf = require('./util/config');

    var app = new Koa();

    var cors = require('koa2-cors');
    //允许跨域
    app.use(cors());

    let filename = path.join(__dirname, 'test.docx');
    let extname = path.extname(filename)
    console.log(filename.replace(extname, '.pdf'))

    const rootdir = conf.rootDirection[conf.currentRoot]  // path.join(__dirname,'statics/upload')

    app.use(koaBody({
        multipart: true,
        formidable: {
            maxFileSize: 2 * 1024 * 1024 * 1024, // 设置上传文件大小最大限制，默认4G
            keepExtensions: true,    // 保持文件的后缀  
            maxFieldsSize: 2 * 1024 * 1024 * 1024, // 文件上传大小
            uploadDir: rootdir, // 设置文件上传目录
            onFileBegin: (name, file) => { // 文件上传前的设置

                const ext = dirhelper.getUploadFileExt(file.name);
                // 最终要保存到的文件夹目录
                const dirName = dirhelper.getUploadDirName(); //dirhelper.getFileNameNoExt( file.name) // +'/'+ dirhelper.getUploadDirName();

                const dir = rootdir + `/${dirName}`;
                //console.log(dir)
                // 检查文件夹是否存在如果不存在则新建文件夹
                dirhelper.checkDirExist(dir);

                // 获取文件名称
                const fileName = dirhelper.getUploadFileName(ext);
                // 重新覆盖 file.path 属性
                file.path = `${dir}/${fileName}`;

            },
            onError: (err) => {
                console.log(err);
            }

        }
    }));


    //配置koa-art-template 模板引擎
    render(app, {
        root: path.join(__dirname, 'views'),
        extname: '.html',
        debug: process.env.NODE_ENV !== 'production'
    });


    app.use(static(
        path.join(__dirname, staticPath), {}
    ))


    //配置路由
    /*
    /admin   配置子路由  层级路由
     /admin/user
     */
    router.use('/admin', admin);
    /*
     /api/newslist   新闻列表的api
     */
    router.use('/uploadapi', api);   /*在模块里面暴露路由并且启动路由*/

    /*
     /主页
     */
    router.use(index);


    //启动路由
    app.use(router.routes()).use(router.allowedMethods());
    let port = 8080

    var server = app.listen(port);
    server.setTimeout(0);
    server.keepAliveTimeout = 1000000;
    // app.setTimeout(0);
    server.on('connection', socket => {
        socket.setTimeout(10 * 60 * 1000); //
        // console.log(socket);

        app.request.remoteip = socket.remoteAddress;

    })


    console.log("service is running with http://localhost:"+port);

})();










