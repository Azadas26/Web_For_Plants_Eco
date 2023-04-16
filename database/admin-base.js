var Promise = require('promise')
var bcrypt = require('bcrypt')
var db = require('../connection/connect')
var consts = require('../connection/consts')
var objectId = require('mongodb').ObjectId

module.exports=
{
    Get_product_list:()=>
    {
        return new Promise(async(resolve,reject)=>
        {
            var products=await db.get().collection(consts.Shope_products).find().toArray()
            resolve(products)
        })
    },
    Remove_Product:(Id)=>
    {
        return new Promise(async(resolve,reject)=>
        {
             await db.get().collection(consts.Shope_products).removeOne({_id:objectId(Id)}).then((data)=>
             {
                resolve(data);
             })
        })
    },
    Get_Details_Of_sHope_Users:()=>
    {
        return new Promise(async(resolve,reject)=>
        {
            var suser=await db.get().collection(consts.Shope_base).find().toArray()
            resolve(suser)
        })
    },
    Remove_Shope_user:(Id)=>
    {
        return new Promise(async(resolve,reject)=>
        {
            await db.get().collection(consts.Shope_base).removeOne({_id:objectId(Id)}).then((data)=>
            {
                resolve(data)
            })
        })
    },
    Get_Details_Of_Normal_users:()=>
    {
        return new Promise(async(resolve,reject)=>
        {
            var user=await db.get().collection(consts.User_base).find().toArray()
            resolve(user)
        })
    },
    Remove_Normal_User:(Id)=>
    {
        return new Promise(async(resolve,reject)=>
        {
            await db.get().collection(consts.User_base).removeOne({_id:objectId(Id)}).then((data)=>
            {
                resolve(data)
            })
        })
    }
}