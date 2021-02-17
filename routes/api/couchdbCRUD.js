const express       =   require('express');
const router        =   express.Router();
const NodeCouchDb   =   require('node-couchdb');

//Connecting to couchDB;

const couch = new NodeCouchDb({
    auth: {
        user: 'admin',
        pass: 'admin'
    }
});

/////// CREATE A NEW DATABASE

// couch.createDatabase('mydb').then(() => {
//     console.log('Database created')
// }, err => {
//     // request error occured
//     console.log(err);
// });



////////  List all the Databases in the CouchDB

router.get('/getAllDatabases',async(req,res)=>{
    try{
        couch.listDatabases()
        .then((dbs)=>{
            res.status(200).json({
                msg:"Databases retireved.",
                result:true,
                data:dbs
            })
        },err=>{
            res.status(400).json({
                msg:"There was a problem fetching the list of all databases.",
                result:false
            })
        });
    }
    catch(err){
        res.status(500).json({
            msg:"There was a problem fetching the list of all databases.",
            result:false
        })
    }
});



//Get a list of all the users in the database - READ

router.get("/getAllUsersDetails",async(req,res)=>{
    try{ 
        couch.mango('mydb',{selector:{}},{}).then(({data, headers, status}) => {
            res.status(200).json({
                    msg:"All User data retireved.",
                    result:true,
                    data:data.docs
            })
        }, err => {
            console.log(err);
            res.status(400).json({
                msg:"There was a problem fetching users data.",
                result:false
            })
        });
    }
    catch(err){
        res.status(500).json({
            msg:"There was a problem fetching all the users data from the database.",
            result:false
        })
    }
});



// INSERT new document in the database - CREATE

router.post("/insertNewUser",(req,res)=>{
    try{ 
        //Creating a unique ID for the document
        couch.uniqid().then((ids) =>{ 

            const newUser = {
                _id:ids[0],
                "name": req.body.name,
                "age": req.body.age,
                "phone": req.body.phone,
                "fav_sitcom": req.body.fav_sitcom
            }
            
            //Saving the document to the database
            couch.insert("mydb", newUser).then(({data, headers, status}) => {
                    res.status(200).json({
                        msg:"New user saved to the database",
                        result:true
                    })
                }, err => {
                    console.log(err);
                    res.status(400).json({
                        msg:"There was a problem saving users data to the database.",
                        result:false
                    })
            });
            
        });

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            msg:"There was a problem saving users data to the database.",
            result:false
        })
    }
});


// Update the user detail - UPDATE

router.post("/updateUserDetails",(req,res)=>{
    try{
        couch.get("mydb",req.body.id).then(({data, headers, status}) => {
            
            const userData = data;

            for (let key in req.body){
                if(key !== "id"){
                    userData[key] = req.body[key];
                }
            }

            // Updating the userdetails
            
            couch.update("mydb",userData).then(({data, headers, status}) => {
                    res.status(200).json({
                        msg:"User updated in the database",
                        result:true
                    })
                }, err => {
                    console.log(err);
                    res.status(400).json({
                        msg:"There was a problem updating users data from the database.",
                        result:false
                    })
            });

        }, err => {
            console.log(err);
            res.status(404).json({
                msg:"User not found",
                result:false
            })
        });
       
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            msg:"There was a problem updating users data in the database.",
            result:false
        })
    }
});



// Deleting a user from the database - DELETE

router.post("/deleteUser",(req,res)=>{
    try{
        const id    =   req.body.id;
        const rev   =   req.body.rev;

        couch.del("mydb", id, rev).then(({data, headers, status}) => {
            res.status(200).json({
                msg:"User deleted from the database",
                result:true
            })
        }, err => {
            console.log(err);
            res.status(400).json({
                msg:"There was a problem deleting users data from the database.",
                result:false
            })
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            msg:"There was a problem deleting users data from the database.",
            result:false
        })
    }
})


module.exports = router;