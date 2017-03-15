const mongodb = require("mongodb");
const ObjectID = mongodb.ObjectID;
const bodyParser = require("body-parser");

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

const dbtools = require('./dbtools.js');
const apiUrl = require('./api-url.js');

const _ = require('lodash');
const waterfall = require('async/waterfall')

const C_EVENTS = "events";
const C_USERS = "users";

module.exports = function (app) {
	dbtools.connect();
	app.use(bodyParser.json());
	setupAuth(app);
	setupApi(app);
}

function setupApi(app) {

	// https://docs.mongodb.com/v3.2/tutorial/geospatial-tutorial/#differences-between-flat-and-spherical-geometry

	app.get(apiUrl + 'commondata', function (req, res) {
		var currentUser = req.user;
		if (currentUser) {
			currentUser.pwd = '<NO>';
		}
		res.status(200).json({
			currentUser: currentUser,
			genreList: [{
				name: 'Клауд реп',
				selected: true
			}, {
				name: 'Вич хаус',
				selected: true
			}, {
				name: 'Вепорвейв',
				selected: true
			}, {
				name: 'Дарк-фолк',
				selected: true
			}, {
				name: 'Ультра-шансон',
				selected: true
			}, {
				name: 'Фуллон',
				selected: true
			}, {
				name: 'Шугейз',
				selected: true
			}]
		}).end();
	});

	app.get(apiUrl + 'user/:user_id', function (req, res) {
		var user_id = ObjectID(req.params.user_id);
		dbtools.getDb().collection(C_USERS).findOne({
			_id: user_id
		}, function (err, doc) {
			if (err) {
				handleError(res, err, "Failed to get user.");
			}
			else {
				res.status(200).json(doc).end();
			}
		});
	});
	/**		
		-------------------------------------------------------------------
									Events
		-------------------------------------------------------------------
	*/
	/*	
		GET получить все
		POST создать новый
	*/

	app.get(apiUrl + 'events', function (req, res) {
		var aRules = [{
			$lookup: {
				from: C_USERS,
				localField: 'author_id',
				foreignField: '_id',
				as: 'author'
			}
		}, {
			$unwind: '$author'
		}];
		dbtools.getDb().collection(C_EVENTS)
			.aggregate(aRules)
			.toArray(function (err, docs) {
				if (err) {
					handleError(res, err, 'Failed to get events');
				}
				else {
					res.status(200).json(docs).end();
				}
			});
	});

	app.post(apiUrl + 'events', function (req, res) {
		if (!req.user) {
			handleError(res, "User not authed");
			return
		}

		var newEvent = _.pick(req.body, ['name', 'date', 'descr', 'latLng']);
		newEvent.author_id = ObjectID(req.user._id);

		dbtools.getDb().collection(C_EVENTS)
			.insertOne(newEvent, function (err, insert) {
				if (err || !insert.result.ok) {
					handleError(res, err, 'Failed to create first reply');
				}
				else {
					res.status(200).json(insert).end();
				}
			});
	});

	app.get(apiUrl + 'events/:event_id', function (req, res) {
		if (!req.params.event_id) {
			handleError(res, err, 'Missing required parameter: event_id');
		}
		var aRules = [{
			$match: {
				_id: ObjectID(req.params.event_id)
			}
		}, {
			$lookup: {
				from: C_USERS,
				localField: 'author_id',
				foreignField: '_id',
				as: 'author'
			}
		}, {
			$unwind: '$author'
		}];
		dbtools.getDb().collection(C_EVENTS)
			.aggregate(aRules)
			.toArray(function (err, docs) {
				if (err || !docs || !docs.length) {
					handleError(res, err, 'Failed to find event');
				}
				else {
					res.status(200).json(docs[0]).end();
				}
			});
	});

	// TODO NOT WORKING!11
	/*app.use(function (req, res, next) {
		res.status(404).send('<h1>Something went wrong</h1>')
	})*/
}

function setupAuth(app) {
	// Local auth
	// http://passportjs.org/docs/username-password
	passport.use(new LocalStrategy(
		function (email, password, done) {
			dbtools.getDb().collection(C_USERS).findOne({
				email: email
			}, function (err, user) {
				if (err) {
					return done(err);
				}
				if (!user || !bcrypt.compareSync(password, user.pwd)) {
					return done(null, false, {
						message: 'XXXX'
					});
				}
				return done(null, user);
			});
		}
	));

	// Configure Passport authenticated session persistence.
	passport.serializeUser(function (user, cb) {
		cb(null, user._id);
	});

	passport.deserializeUser(function (_id, cb) {
		dbtools.getDb().collection(C_USERS).findOne({
			_id: ObjectID(_id)
		}, function (err, user) {
			if (err) {
				return cb(err);
			}
			cb(null, user);
		});
	});

	app.use(require('cookie-parser')());
	app.use(require('body-parser').urlencoded({
		extended: true
	}));
	app.use(require('express-session')({
		secret: 't0psecret',
		resave: false,
		saveUninitialized: false
	}));
	app.use(passport.initialize());
	app.use(passport.session()); // restore auth state, if any, from the session

	var resultUrl = apiUrl + 'auth/result';

	/**
		Log in
	*/
	app.post(apiUrl + 'auth/in',
		passport.authenticate('local', {
			successRedirect: resultUrl,
			failureRedirect: resultUrl
		})
	);
	/**
		Log out
	*/
	app.post(apiUrl + 'auth/out', function (req, res) {
		req.logout();
		res.redirect(resultUrl);
	});

	app.get(resultUrl, function (req, res) {
		if (req.user) {
			req.user.pwd = '<NO>';
		}
		res.json({
			currentUser: req.user
		});
	});
	/**
		Edit profile
	*/
	app.post(apiUrl + 'auth/edit', function (req, res) {
		if (!req.user) {
			handleError(res, 'User not authed');
			return
		}
		if (req.user._id.toString() !== req.body._id) {
			handleError(res, 'Attempt to edit not own account');
			return
		}
		var userUpd = _.pick(req.body, ['email', 'name', 'bdate', 'password', 'role', 'descr'])
		userUpd.role = Math.abs(req.body.role | 0); // -1 is Admin, 0 is listener, 1 is musician

		dbtools.getDb().collection(C_USERS)
			.updateOne({
				_id: req.user._id
			}, {
				$set: userUpd
			}, function (err, cmdres) {
				if (err || !cmdres || !cmdres.result || !cmdres.result.ok) {
					handleError(res, err || cmdres, 'User update failed');
				}
				else {
					res.status(201).json({
						ok: 1
					}).end();
				}
			});
	});
	/**
		Reqistration
	*/
	const bcrypt = require('bcrypt');
	const saltRounds = 8;

	app.post(apiUrl + 'auth/reg', function (req, res) {
		if (req.user) {
			// user already authed
			req.logout();
		}
		// checking request data
		var reqd = ['email', 'password', 'name'];
		for (let k of reqd) {
			if (typeof req.body[k] === 'undefined') {
				handleError(res, err, 'Not enough data (' + k + ')');
				return;
			}
		}

		var newUser = _.pick(req.body, ['email', 'name']);
		newUser.role = Math.abs(req.body.role | 0); // -1 is Admin, 0 is listener, 1 is musician
		newUser.date = new Date;
		newUser.online = true;
		newUser.rating_total = 0;
		newUser.pic = 'userpics/2.png';

		var db = dbtools.getDb();

		waterfall([
			// check if email is unique
			// TODO create unique constraint on email
			// https://docs.mongodb.com/manual/reference/method/db.collection.createIndex/
			function (next) {
				db.collection(C_USERS).find({
					email: req.body.email
				}).toArray(function (err, docs) {
					//console.log(err || docs.length !== 0)
					var fail = err || docs.length !== 0;
					next(err || docs.length !== 0 ? 'User with speciafied email already exists' : null)
				})
			},
			// Generating pwd hash
			function (next) { // TODOOOOO
				//console.log('bcrypt.hash', arguments)
				bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
					newUser.pwd = hash;
					next();
				});
			},
			// Inserting user
			function (next) {
				db.collection(C_USERS)
					.insertOne(newUser, function (err, insert) {
						newUser = insert.ops[0];
						next(err || !insert.result.ok ? 'Failed to create new user' : null);
					});
			}
		], waterfallFinal)

		function waterfallFinal(err) {
			if (err) {
				handleError(res, err, err);
			}
			else {
				req.login(newUser, function (err) {
					if (err) {
						// potential error from the login() callback would come from your serializeUser() function
						handleError(res, 'Automatic login of new user failed');
					}
					else {
						newUser.pwd = '<NO>';
						res.status(201).json(newUser).end();
					}
				})
			}
		}
	});


}


function handleError(res, errObjOrStr, message, code) {
	var reason = !!errObjOrStr && errObjOrStr.message ? errObjOrStr.message : errObjOrStr; // sweet jesus
	console.log('API ERROR: ' + JSON.stringify(reason));
	res.status(code || 500).json({
		"error": message
	}).end();
}

// app.use(require('compression')) 
// with default settings it decreases page size (232 vs 767 KB)
// but increases CPU load and therefore page speed
// i preferred build-time compression, see _main-server.js
// compression invocation is not here because its not needed for webpack dev server

// Handling a case when app is built for Cordova, therefore api becomes remote
// Im not sure that Access-Control-Allow-Origin:* is OK for production
// see also api-url.js
/*var isHeroku = !!process.env.PORT
if (isHeroku) {
	app.use(function (req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	})
}*/