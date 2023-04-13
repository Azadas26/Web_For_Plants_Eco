var mongoClient = require('mongodb').MongoClient
var Pronise = require('promise')

var state =
{
    db: null
}

module.exports =
{
    Connect_db: () => {
        return new Pronise((resolve, reject) => {
            var dbname = "ShopePlants"
            mongoClient.connect("mongodb://127.0.0.1", { useNewUrlParser: true, useUnifiedTopology: true },(err,done)=>
                {
                    if(err) {
                        reject("DataBase connection Error...")
                    }
                    else
                    {
                        state.db=done.db(dbname)
                        resolve("Database Connection Successfull...")
                    }
                })
        })
    },
    get:()=>
    {
        return state.db
    }
}