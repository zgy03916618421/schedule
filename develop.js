/**
 * Created by zhougy on 12/26/16.
 */
var schedule = require('node-schedule')
var redis = require('redis'),
    client = redis.createClient(6379,'192.168.100.2',{})
setInterval(function () {
    client.zrange('virus_hot_rank',0,-1,'withscores',function (err,reply) {
        var sum = 0
        reply.map(function (item,index,array) {
            if((index+1) % 2 == 0){
                sum = sum + parseInt(item);
            }
        })
        /*client.set('virus_rank_sum',sum,function (err,rep) {

         })*/
        client.zinterstore('temp_virus_probability',2,'virus_hot_rank','virusset','weights',1 / sum,0,function (err,reply) {
            if(err) console.log(err);
            else {
                var score = 0;
                client.zrange('temp_virus_probability',0,-1,'withscores',function (err,elems) {
                    elems.map(function (item,index,array) {
                        if((index+1) % 2 == 0){
                            score = score + parseFloat(item);
                            client.zadd('virus_hot_probability',score,array[index-1],function (err,reply) {
                                console.log(reply)
                            })
                        }
                    })
                })
            }
        })

    })
},30000)


