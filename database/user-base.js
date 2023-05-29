var Promise = require('promise')
var bcrypt = require('bcrypt')
var db = require('../connection/connect')
var consts = require('../connection/consts')
const { json } = require('express')
var objectId = require('mongodb').ObjectId

module.exports =
{
    Get_all_Products: () => {
        return new Promise(async (resolve, reject) => {
            var allProducts = await db.get().collection(consts.Shope_products).find().toArray()

            resolve(allProducts);
        })
    },
    Do_signup: (data) => {
        return new Promise(async (resolve, reject) => {
            data.password = await bcrypt.hash(data.password, 10)
            db.get().collection(consts.User_base).insertOne(data).then((data) => {
                //console.log(data)
                resolve("Account Created...")
            })
        })
    },
    Do_login: (details) => {
        return new Promise(async (resolve, reject) => {
            //console.log(data.semail)

            await db.get().collection(consts.User_base).findOne({ email: details.email }).then(async (data) => {
                //console.log(data)
                if (data) {
                    await bcrypt.compare(details.password, data.password).then((info) => {
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
    Products_Into_Cart: (userId, proId) => {
        return new Promise(async (resolve, reject) => {
            var pro =
            {
                proid: objectId(proId),
                quantity: 1
            }

            var cart = await db.get().collection(consts.Cart_base).findOne({ user: objectId(userId) })
            if (cart) {


                var st = cart.product.findIndex(pro => pro.proid == proId)
                if (st != -1) {
                    //console.log("hi..")
                    await db.get().collection(consts.Cart_base).updateOne({ "product.proid": objectId(proId), user: objectId(userId) },
                        {
                            $inc: { "product.$.quantity": 1 }
                        }).then((data) => {
                            resolve(data)
                        })
                }
                else {
                    await db.get().collection(consts.Cart_base).updateOne({ user: objectId(userId) },
                        {
                            $push:
                            {
                                product: pro
                            }
                        }).then((data) => {
                            resolve(data)
                        })
                }
            }
            else {
                var state =
                {
                    user: objectId(userId),
                    product: [pro]

                }
                await db.get().collection(consts.Cart_base).insertOne(state).then((data) => {
                    resolve(data)
                })
            }
        })
    },
    Get_cart_count: (userId) => {
        return new Promise(async (resolve, reject) => {

            var cart = await db.get().collection(consts.Cart_base).findOne({ user: objectId(userId) })
            if (cart) {
                resolve(cart.product.length);
            }
            else {
                resolve(0)
            }



        })
    },
    Get_carted_products_Details: (userId) => {
        return new Promise(async (resolve, reject) => {
            var cartItems = await db.get().collection(consts.Cart_base).aggregate([
                {
                    $match: { user: objectId(userId) }
                },
                {
                    $unwind: "$product"
                },
                {
                    $project:
                    {
                        proid: "$product.proid",
                        quantity: "$product.quantity"
                    }
                },
                {
                    $lookup:
                    {
                        from: consts.Shope_products,
                        localField: "proid",
                        foreignField: "_id",
                        as: 'product'
                    }
                },
                {
                    $project:
                    {
                        proid: 1, quantity: 1,
                        first: { $arrayElemAt: ["$product", 0] },
                    }
                },

            ]).toArray()
            //console.log(cartItems)
            //console.log(cartItems[0].first);
            resolve(cartItems);
        })
    },
    Change_product_Quantity: (data) => {
        console.log(data)
        return new Promise(async (resolve, reject) => {
            if (data.quantity == 1 && data.cut == -1) {
                await db.get().collection(consts.Cart_base).updateOne({ _id: objectId(data.cartid) }, {
                    $pull: { product: { proid: objectId(data.proid) } }
                }).then((data) => {
                    resolve({ data: true })
                })
            }
            else {
                await db.get().collection(consts.Cart_base).updateOne({ _id: objectId(data.cartid), "product.proid": objectId(data.proid) },
                    {
                        $inc:
                        {
                            "product.$.quantity": parseInt(data.cut)
                        }
                    }).then((data) => {
                        resolve({ data: false });
                    })
            }
        })
    },
    Remove_cart_product: (proId, userId) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(consts.Cart_base).updateOne({ user: objectId(userId) },
                {
                    $pull: { product: { proid: objectId(proId) } }
                }).then((data) => {
                    resolve(data);
                })
        })
    },
    Total_amount_from_carted_products: (userId) => {
        return new Promise(async (resolve, reject) => {
            var total = await db.get().collection(consts.Cart_base).aggregate([
                {
                    $match: { user: objectId(userId) }
                },
                {
                    $unwind: "$product"
                },
                {
                    $project:
                    {
                        proid: "$product.proid",
                        quantity: "$product.quantity"
                    }
                },
                {
                    $lookup:
                    {
                        from: consts.Shope_products,
                        localField: "proid",
                        foreignField: "_id",
                        as: 'product'
                    }
                },
                {
                    $project:
                    {
                        proid: 1, quantity: 1,
                        first: { $arrayElemAt: ["$product", 0] },
                    }
                },
                {
                    $group:
                    {
                        _id: null,
                        totalAmount: { $sum: { $multiply: ["$first.pro.pprice", "$quantity"] } }
                    }
                }



            ]).toArray()

            if (total[0]) {
                resolve(total[0].totalAmount)
            }
            else {
                resolve(0)
            }

            //console.log(cartItems[0].first);
            //resolve(cartItems);
        })
    },
    Get_Product_info_TO_BE_clicked: (Id) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(consts.Shope_products).findOne({ _id: objectId(Id) }).then((pro) => {
                resolve(pro)
            })
        })
    },
    Get_Cart_Products: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(consts.Cart_base).findOne({ user: objectId(userId) }).then((pro) => {
                resolve(pro)
            })
        })
    },
    Place_Order_From_user: (info) => {
        return new Promise((resolve, reject) => {
            db.get().collection(consts.Order_Products).insertOne(info).then((data) => {
                resolve(data);
            })
        })
    },
    Remove_All_ProductsFromthe_UserCartAt_theTimeOf_Place_Order: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(consts.Cart_base).removeOne({ user: objectId(userId) }).then((rem) => {
                resolve(rem)
            })
        })
    },
    View_Plaeced_Orders: (userId) => {
        return new Promise(async (resolve, reject) => {
            var proinfo = await db.get().collection(consts.Order_Products).aggregate([
                {
                    $match:
                    {
                        userId: objectId(userId)
                    }
                },
                {
                    $unwind: '$products'
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
                        from: consts.Shope_products,
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
                        quantity:1
                    }
                }

            ]).toArray()
            console.log(proinfo[0]);
            resolve(proinfo)

        })
    }
}


