/**
 * Created by gaoshaowen on 2018/3/20 0020.
 */
var router=require('koa-router')();
const path=require('path');
const fs =require('fs');
const dirhelper = require('../util/DirectoryHelper.js');
const conf = require('../util/config.js');
var urlencode = require('urlencode');
var uuidv1 = require('uuid/v1')

router.get('/order',async (ctx)=>{
    console.log(ctx.query)
    if ( ! ctx.query.order_id ){
        var out_trade_no =''
        var rows=null

        let total_fee = ctx.query.total_fee || 0.01

        while(true){

            out_trade_no = uuidv1()

            out_trade_no = out_trade_no.replace(/-/g,'').substring(0,32)

            try {
                rows= await mysqlhelp.addmodel('printorder', {id: out_trade_no, pay_money:total_fee, pay_status:0})
      
                if (rows.affectedRows>0)
                    break;

            } catch (error) {
                console.log(error)
            }
          
        }
       
        ctx.body={   
            out_trade_no, // ⇨ '45745c60-7b1a-11e8-9c9c-2d42b21b1a3e', //后台生成的订单号
            total_fee
        };

    } else {
        //根据订单查该订单的数据
        let row = await mysqlhelp.first( 'select * from  printorder where id=?',  ctx.query.order_id)
        console.log(row)
        ctx.body= row
    
    } 

})

router.post( '/orderpaystatus', async (ctx)=>{
    let {order_id ,  //订单号
        pay_account, //微信交易流水号
        pay_status //交易状态
        } =ctx.request.body 
    console.log('order_id:', order_id)
    console.log('pay_account:', pay_account)
    console.log('pay_status:', pay_status)

    try {
        rows= await mysqlhelp.updatemodel('printorder', {pay_account, pay_status}, order_id)
        ctx.body ={code:1, msg:'ok'}   

    } catch (error) {
        console.log(error)
        ctx.body ={code:0, msg:error}  
    }
    
})


router.get('/getorder',async (ctx)=>{
    console.log(ctx.query)
    if ( ! ctx.query.order_id ){
        ctx.body={code:0, msg:'no order_id param'}

    } else {
        //根据订单查该订单的数据
        let row = await mysqlhelp.first( 'select * from  printorder where id=?',  ctx.query.order_id)
        console.log(row)
        ctx.body={code:1, data: row}
    
    } 

})


router.get('/login/:username/:password',async (ctx)=>{ //login/liming/123456
    var username= ctx.params.username   //liming
    var password= ctx.params.password   //123456
   
    ctx.body=user;
})





module.exports=router.routes();