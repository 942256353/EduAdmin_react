const router = require('@koa/router')();

const {modelDataStudent} = require('../../models/collection');


router.post('/create',async (ctx)=>{
    console.log('create')
    const res = await modelDataStudent.create([

       {year:'2020',count:5423},
       {year:'2019',count:5426},
       {year:'2018',count:5589},
       {year:'2017',count:5371},
       {year:'2016',count:5102},
       {year:'2015',count:4956},
       {year:'2014',count:5003},
       {year:'2013',count:5202},
       {year:'2012',count:5126},
       {year:'2011',count:5106},
       {year:'2010',count:4524},
    ])
    ctx.body = {
        code:20000,
        message:'success',
        data:res
    };
    console.log(res)
});

router.get("/list",async(ctx) => {
    const res = await modelDataStudent.find({},{_id:0});
    ctx.body = {
        code:20000,
        message:'success',
        data:res
    };
})

module.exports = router.routes();