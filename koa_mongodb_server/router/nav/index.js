const router = require('@koa/router')();

const {modelNav} = require('../../models/collection');


router.post('/create',async (ctx)=>{
    console.log('create')
    const res = await modelNav.create([
        {url:'http://127.0.0.1:7003/static/img/1.jpg',title:'家居'},
        {url:'http://127.0.0.1:7003/static/img/2.jpg',title:'男装'},
        {url:'http://127.0.0.1:7003/static/img/3.jpg',title:'女装'},
        {url:'http://127.0.0.1:7003/static/img/4.jpg',title:'名鞋'},
        {url:'http://127.0.0.1:7003/static/img/5.jpg',title:'绿植'}
    ])
    ctx.body = {
        code:200,
        message:'success',
        data:res
    };
    console.log(res)
});

router.get("/list",async(ctx) => {
    const res = await modelNav.find({});
    console.log(res)
    ctx.body = res;
})

module.exports = router.routes();