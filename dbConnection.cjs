const {MongoClient} = require('mongodb')

let dbConnection
function connectToDb(callBack) {
   dbConnection = MongoClient.connect('mongodb+srv://kaviya2004:kaviya2004@cluster0.ma5usqs.mongodb.net/expenseData?retryWrites=true&w=majority').then(function(client) {
        dbConnection = client.db()
        callBack()
    }).catch(function(error) {
        callBack(error)
    })
}

function getDb() {
    return dbConnection
}

// Exporting required functions
module.exports = {connectToDb, getDb}