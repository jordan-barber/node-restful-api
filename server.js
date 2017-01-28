var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Car = require('./models/cars');
var app = express();

mongoose.connect('mongodb://jordan:root@ds015780.mlab.com:15780/noderesfulexample')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8000;

var router = express.Router();

router.use(function(req, res, next) {
    console.log('Someone has made a request on the API.');
    next();
});

router.get('/', function(req, res) {
    res.json({ message: 'The API is up and running.'});
});

router.route('/cars')
	.post(function(req, res) {
		
		var car = new Car();		
		car.name = req.body.name;  

		car.save(function(err) {
			if (err) {
				res.send(err);
            }

			res.json({ message: 'A car has been created!' });
		});

		
	})

	.get(function(req, res) {
		Car.find(function(err, car) {
			if (err) {
				res.send(err);
            }

			res.json(car);
		});
	});

    router.route('/cars/:car_id')
    .get(function(req, res) {
        Car.findById(req.params.car_id, function(err, car) {
            if (err) {
                res.send(err);
            }
            res.json(car);
        })
    })

    .put(function(req, res) {
        Car.findById(req.params.car_id, function(err, car) {
            if (err) {
                res.send(err);
            }
            car.name = req.body.name;

            car.save(function(err) {
                if (err) {
                    res.send(err);
                }
                res.json({message: 'The following car ' + req.params.car_id + ' has been updated.'});
            });
        });
    })

    .delete(function(req, res) {
        Car.remove({
            _id: req.params.car_id
        }, function(err, car) {
            if (err) {
                res.send(err);
            }
            res.json({message: 'The following car ' + req.params.car_id + ' has been deleted.'})
        });
    });


app.use('/api', router);
app.listen(port);

console.log('The RESTful API is listening on port 8000.');
