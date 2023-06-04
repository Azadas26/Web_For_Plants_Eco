var Promise = require('promise')
var bcrypt = require('bcrypt')
var db = require('../connection/connect')
var consts = require('../connection/consts')
var objectId = require('mongodb').ObjectId

module.exports =
{
    Get_product_list: () => {
        return new Promise(async (resolve, reject) => {
            var products = await db.get().collection(consts.Shope_products).aggregate([
                {
                    $project:
                    {
                        _id: 1,
                        pro: 1,
                        shopeId: 1
                    }
                },
                {
                    $lookup:
                    {
                        from: consts.Shope_base,
                        localField: 'shopeId',
                        foreignField: "_id",
                        as: 'shops'
                    }
                },
                {
                    $project:
                    {
                        _id: 1,
                        pro: 1,
                        shopeId: 1,
                        shops:
                        {
                            $arrayElemAt: ["$shops", 0]
                        }
                    }
                }
            ]).toArray()
            console.log(products);
            resolve(products)
        })
    },
    Remove_Product: (Id) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(consts.Shope_products).removeOne({ _id: objectId(Id) }).then((data) => {
                resolve(data);
            })
        })
    },
    Get_Details_Of_sHope_Users: () => {
        return new Promise(async (resolve, reject) => {
            var suser = await db.get().collection(consts.Shope_base).find().toArray()
            resolve(suser)
        })
    },
    Remove_Shope_user: (Id) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(consts.Shope_base).removeOne({ _id: objectId(Id) }).then((data) => {
                resolve(data)
            })
        })
    },
    Get_Details_Of_Normal_users: () => {
        return new Promise(async (resolve, reject) => {
            var user = await db.get().collection(consts.User_base).find().toArray()
            resolve(user)
        })
    },
    Remove_Normal_User: (Id) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(consts.User_base).removeOne({ _id: objectId(Id) }).then((data) => {
                resolve(data)
            })
        })
    },
    Get_shope_Requests_TO_Admit: () => {
        return new Promise(async (resolve, reject) => {
            var shopeinfo = await db.get().collection(consts.Temp_shope_Base).find().toArray()
            resolve(shopeinfo)
        })
    },
    Remove_Shope_user_from_TEMP_Base: (Id) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(consts.Temp_shope_Base).removeOne({ _id: objectId(Id) }).then((data) => {
                resolve(data)
            })
        })
    },
    Get_user_orders_all_Connected_informations: () => {
        return new Promise(async (resolve, reject) => {
            var pro = await db.get().collection(consts.Order_Products).aggregate([
                {
                    $unwind: "$products"
                },
                {
                    $project:
                    {
                        total: 1,
                        status: 1,
                        pay: 1,
                        userId: 1,
                        date: 1,
                        items: '$products.proid',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup:
                    {
                        from: consts.Shope_products_Duplicate,
                        localField: 'items',
                        foreignField: "_id",
                        as: 'pro'

                    }
                },
                {
                    $project:
                    {
                        total: 1,
                        status: 1,
                        pay: 1,
                        userId: 1,
                        date: 1,
                        products:
                        {
                            $arrayElemAt: ['$pro', 0]
                        },
                        quantity: 1,
                        shopeId: "$products.shopeId"
                    }
                },
                {
                    $lookup:
                    {
                        from: consts.User_base,
                        localField: 'userId',
                        foreignField: "_id",
                        as: 'users'
                    }
                },
                {
                    $project:
                    {
                        shopId: "$products.shopeId",
                        total: 1,
                        status: 1,
                        pay: 1,
                        userId: 1,
                        date: 1,
                        products: 1,
                        quantity: 1,
                        users: {
                            $arrayElemAt: ['$users', 0]
                        }
                    }
                },
                {
                    $lookup:
                    {
                        from: consts.Shope_base,
                        localField: 'shopId',
                        foreignField: "_id",
                        as: 'shops'
                    }
                },
                {
                    $project:
                    {

                        total: 1,
                        status: 1,
                        pay: 1,
                        userId: 1,
                        date: 1,
                        products: 1,
                        quantity: 1,
                        users: 1,
                        shops: {
                            $arrayElemAt: ['$shops', 0]
                        }
                    }
                }
            ]).toArray()
            console.log(pro);
            resolve(pro)
        })
    },
    Remove_Products_At_TheTimeOf_removeSdhopes: (shId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(consts.Shope_products).remove({ shopeId: objectId(shId) }).then((data) => {
                resolve(data)
            })
        })
    },
    Do_admin_LoGIN: (info) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(consts.Admin_base).findOne({ name: info.aname }).then(async (data) => {
                if (data) {
                    await db.get().collection(consts.Admin_base).findOne({ password: info.apassword }).then((info) => {
                        if (info) {
                            console.log(info);
                            resolve({ info, status: true })
                        }
                        else {
                            resolve({ status: false })
                        }
                    })
                } else {
                    resolve({ status: false })
                }
            })
        })
    }
}

