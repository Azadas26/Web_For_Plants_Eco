var Promise = require('promise')
var bcrypt = require('bcrypt')
var db = require('../connection/connect')
var consts = require('../connection/consts')
var objectId = require('mongodb').ObjectId

module.exports =
{
    shope_info_temparrayBase:(data)=>
    {
        return new Promise(async (resolve, reject) => {
          
            db.get().collection(consts.Temp_shope_Base).insertOne(data).then((data) => {
                //console.log(data)
                resolve("Account Created...")
            })
        })
    },
    Do_signup: (data) => {
        return new Promise(async (resolve, reject) => {
            data.spassword = await bcrypt.hash(data.spassword, 10)
            db.get().collection(consts.Shope_base).insertOne(data).then((data) => {
                //console.log(data)
                resolve("Account Created...")
            })
        })
    },
    Do_login: (details) => {
        return new Promise(async (resolve, reject) => {
            //console.log(data.semail)

            await db.get().collection(consts.Shope_base).findOne({ semail: details.semail }).then(async (data) => {
                //console.log(data)
                if (data) {
                    await bcrypt.compare(details.spassword, data.spassword).then((info) => {
                        // console.log(info)
                        if (info) {
                            var state =
                            {
                                status: true,
                                user: data

                            }
                            resolve(state)
                            console.log("Login successfull...")
                        }
                        else {
                            console.log("Incorrect Passwoed....")
                            resolve({ status: false })
                        }
                    })
                }
                else {
                    console.log("Incorrect Email addresss...")
                    resolve({ status: false })
                }
            })
        })
    },
    Add_products: (products) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(consts.Shope_products).insertOne(products).then((data) => {
                //console.log(data.ops[0]._id)
                resolve(data.ops[0]._id)
            })
        })
    },
    Get_shopes_products: (sId) => {
        return new Promise(async (resolve, reject) => {
            var pro = await db.get().collection(consts.Shope_products).find({ shopeId: sId }).toArray()

            //console.log(pro);
            resolve(pro)
        })
    },
    Delete_peoduct: (Id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(consts.Shope_products).removeOne({ _id: objectId(Id) }).then((data) => {
                //console.log(data)
                resolve(data)
            })
        })
    },
    Get_Product_Detailsfor_Edit: (Id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(consts.Shope_products).findOne({ _id: objectId(Id) }).then((data) => {
                //console.log(data)
                resolve(data)
            })
        })
    },
    Update_products_details: (Id, info) => {
        //console.log(info)
        return new Promise(async (resolve, reject) => {
            await db.get().collection(consts.Shope_products).updateOne({ _id: objectId(Id) },
                {
                    $set:
                    {
                        "pro.pname": info.pname,
                        "pro.pprice": info.pprice,
                        "pro.pdiscription": info.pdiscription
                    }
                })
                .then((data) => {
                    resolve(data)
                })
        })
    },
    
}