
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const {connectToDb, getDb} = require('./dbConnection.cjs')
const { ObjectId } = require('mongodb')
const app = express()
app.use(cors())
app.use(bodyParser.json())


let db
connectToDb(function(error) {
    if(error) {
        console.log('Could not establish connection...')
        console.log(error)
    } else { // if no error in establishing connection
        app.listen(8000)
        db = getDb()
        console.log('Listening on port 8000...')
    }
})

app.post('/add-entry', function(request, response) {
    db.collection('ExpenseData').insertOne(request.body).then(function() {
        response.status(201).json({
            "status" : "Entry added successfully"
        })
    }).catch(function () {
        response.status(500).json({
            "status" : "Entry not added"
        })
    })
})


app.get('/get-entries', function(request, response) {
    // Declaring an empty array
    const entries = []
    db.collection('ExpenseData').find().forEach(entry => entries.push(entry)) //travese array iteration
    .then(function() {
        response.status(200).json(entries)
    }).catch(function() {
        response.status(500).json({
            "status" : "Could not fetch documents"
        })
    })
})

app.delete('/delete-entry', function(request,response){
    db.collection('ExpenseData').deleteOne({
        _id:  new ObjectId(request.query.id)
    }).then(function() {
        response.status(200).json({
            "status":  "Deleted Successfully"
        })
    }).catch(function(){
        response.status(500).json({
            "status" : "Deleted Failed"
        })
    })
})

app.patch('/update-entry/:id', function(request, response){
    if(ObjectId.isValid(request.params.id)) {
        db.collection('ExpenseData').updateOne(
            { _id : new ObjectId(request.params.id) }, // identifies 
            { $set : request.body }
            ).then(function(){
                response.status(200).json({
                    "status" : "Entry Updated Successfully"
                })
            }).catch(function() {
                response.status(500).json({
                    "status" :  "Failed to update entry"
                })
            })
    } else {
        response.status(500).json ({
            "status" : "ObjectId not valid"
        })
    }
})

