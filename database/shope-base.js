var Promise = require('promise')
var bcrypt = require('bcrypt')
var db = require('../connection/connect')
var consts = require('../connection/consts')

module.exports =
{
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
                    await bcrypt.compare(details.spassword,data.spassword).then((info) => {
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
                        else
                        {
                            console.log("Incorrect Passwoed....")
                            resolve({ status: false })
                        }
                    })
                }
                else
                {
                    console.log("Incorrect Email addresss...")
                    resolve({ status: false })
                }
            })
        })
    }
}