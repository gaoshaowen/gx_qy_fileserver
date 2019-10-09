/**
 * Created by Administrator on 2018/3/20 0020.
 */

/*轮播图的增加修改删除*/


var router=require('koa-router')();

router.get('/',async (ctx)=>{

    await  ctx.render('admin/login/index');
})

router.post('/', async (ctx)=>{

    ctx.body ="这是登录post方法";

})


router.get('/out',async (ctx)=>{
    
    console.log(ctx.request.url);

    ctx.body ="<script>alert('成功登出'); location.href='/admin/login'; </script>"
    //ctx.redirect('/admin/login');
})

// router.get('/register',async (ctx)=>{

//     await  ctx.render('admin/login/register');

// })

// router.post('/register', async (ctx)=>{

//     ctx.body ="这是 register  post方法";

// })

module.exports=router.routes();
