var express = require('express');
var router = express.Router();
var path = require('path')
/* GET home page. */
router.get('/', function(req, res, next) {
  //res.sendFile(path.resolve('views/index.html'));
  res.render('index', { title: 'Express' });
});


router.post('/get', function(req,res,next){
	console.log('hejj');
	var usernam = req.body.username;
	var date = req.body.datepicker;
	var db = req.db;
	var collection = db.get('locations');

	console.log(usernam);


	collection.find( {"username":usernam},function(err,docs){
		if(err != null)
		{
			//console.log(err);
			res.sendStatus(404);
		}else
		{
		var arrayLength = docs[0].locations.length;
		for (var i = 0; i < arrayLength; i++) {
		    //Do something
			if(docs[0].locations[i].Date == date){
				 res.render('index', { 
			 	"locationlist" : JSON.stringify(docs[0].locations[i].points)
				 });
			}
		}

			res.sendStatus(404);
		}
	});
});

//
// input data to db
//



router.post('/insert', function(req,res,next){

	console.log('hej');
    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var locations = req.body.locations;

    // Set our collection
    var collection = db.get('locations');
    console.log('insert');

let user = new Promise(function(resolve,reject){
    	collection.find(
    	{username: userName},function(err,doc){
    		if(err)
    		{
    			reject(err);
    		}else{
    			resolve(doc);
    		}
    	});
});


let findLocations = new Promise( (resolve, reject) =>{
	collection.find({ "locations.0.Date": {$eq: locations.Date}},
		function(err,doc){
			if(err){
				reject(err);
			}else{
				resolve(doc);
			}
		}
		);
});



    console.log(user);

user.then(doc =>{

	if(doc.length ==0){
    	console.log('insert user');
    	collection.insert({
    		username: userName,
    		locations: [ locations]
    	},
    		function (err, doc) {
		        if (err) {
		        	console.log(err)
		            // If it failed, return error
		            res.send(403);
		        }
		        else {
		        	console.log(doc)
		            // And forward to success page
		            res.send(200);
		        }
		    }
    	);
    }
    else
    {
    	findLocations.then(doc =>{
    		
    		//day not found
    		if(doc.length ==0)
    		{
    			console.log('add locations');
    			collection.update({username: userName},
    			{$addToSet:{locations: locations}},function(err,doc){
    			if (err) {
		        	console.log(err)
		            // If it failed, return error
		            res.send(403);
		        }
		        else {
		        	console.log(doc)
		            // And forward to success page
		            res.send(200);
		        
    			}
    			});
    		}else
    		{
    			console.log('push points');
    			collection.update({username: userName},
    			{$pushAll:{ "locations.0.points": locations.points}},function(err,doc){
    			if (err) {
		        	console.log(err)
		            // If it failed, return error
		            res.send(403);
		        }
		        else {
		        	console.log(doc)
		            // And forward to success page
		            res.send(200);
		        
    			}
    			});
    		}
    	})
    }
});
    console.log('koniec');
});

module.exports = router;
