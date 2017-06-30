// MongoDB stuff
const mongodb = require("mongodb");
const ObjectID = mongodb.ObjectID;
const ISODate = mongodb.ISODate;
const C_EVENTS = "events";
const C_USERS = "users";
const C_GENRES = "genres";
// Auth strategies
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const VKontakteStrategy = require('passport-vkontakte').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
// Helper libs
const _ = require('lodash');
const waterfall = require('async/waterfall');
const moment = require('moment');
// Homebrew stuff
const CONF = require('./conf/conf.js');
const dbtools = require('./dbtools.js');
const _api = require('./api-url.js');
const apiUrl = _api.path;

module.exports = function(app) {
	dbtools.connect();
	app.use(require("body-parser").json());
	setupAuth(app);
	setupApi(app);
}

function setupApi(app) {

	// https://docs.mongodb.com/v3.2/tutorial/geospatial-tutorial/#differences-between-flat-and-spherical-geometry

	app.get(apiUrl + 'commondata', function(req, res) {
		var currentUser = req.user;
		if (currentUser) {
			currentUser.pwd = '<NO>';
		}

		dbtools.getDb().collection(C_GENRES).find().toArray(
			function(err, docs) {
				if (err) {
					handleError(res, err, 'Failed to get common data');
				}
				else {
					res.status(200).json({
						currentUser: currentUser,
						genreList: docs
					}).end();
				}
			});
	});

	app.get(apiUrl + 'user/:user_id', function(req, res) {
		var user_id = ObjectID(req.params.user_id);
		dbtools.getDb().collection(C_USERS).findOne({
			_id: user_id
		}, function(err, doc) {
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

	app.get(apiUrl + 'events', function(req, res) {
		var COL = dbtools.getDb().collection(C_EVENTS);
		var match = {};
		if (req.query.own) {
			if (req.user) {
				match.author_id = ObjectID(req.user._id)
			}
			else {
				handleError(res, 'Unauthorized', 'Unauthorized', 403);
				return
			}
		}
		var TS = req.query.text;
		if (TS) {
			COL.createIndex({ // do I need to check text index each time via getIndexes?
				name: 'text',
				descr: 'text'
			});

			/*
				Mongo 's full-text doesnt support word partials and wildcards, so
				if search string length less than 4 then mongo will look for exact words			
			*/
			if (TS.length < 4) {
				match.$text = {
					$search: TS // , $language: 'russian' TODO req.user.lang or something
				};
			}
			else {
				var reSearch = {
					$regex: TS,
					$options: 'i'
				};
				match.$or = [{
					name: reSearch
				}, {
					descr: reSearch
				}];
			}
		}

		var DS = req.query.date;
		if (DS) {
			var MD = moment(DS);
			match.date = { // yup, event date is a string
				$gte: MD.startOf('day').toISOString(),
				$lte: MD.endOf('day').toISOString()
			};
		}

		var aRules = [{
			$match: match
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
		COL.aggregate(aRules).toArray(function(err, docs) {
			if (err) {
				handleError(res, err, 'Failed to get events');
			}
			else {
				res.status(200).json({
					evtList: docs
				}).end();
			}
		});
	});

	app.post(apiUrl + 'events', function(req, res) {
		if (!req.user) {
			handleError(res, "User not authed");
			return
		}

		var newEvent = _.pick(req.body, ['name', 'date', 'descr', 'latLng', 'genre_id']);
		newEvent.author_id = ObjectID(req.user._id);

		dbtools.getDb().collection(C_EVENTS)
			.insertOne(newEvent, function(err, insert) {
				if (err || !insert.result.ok) {
					handleError(res, err, 'Failed to create first reply');
				}
				else {
					res.status(200).json(insert).end();
				}
			});
	});

	app.get(apiUrl + 'events/:event_id', function(req, res) {
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
			.toArray(function(err, docs) {
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


/**
	======================================================================================
	======================================================================================
	======================================================================================	
	         AUTH
	======================================================================================
	======================================================================================
	======================================================================================

*/



function setupAuth(app) {
	/**
		Basic setup
	*/
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

	passport.serializeUser(function(user, cb) {
		cb(null, user._id);
	});
	passport.deserializeUser(function(_id, cb) {
		dbtools.getDb().collection(C_USERS).findOne({
			_id: ObjectID(_id)
		}, function(err, user) {
			if (err) {
				console.log('LOOKS LIKE TOPOLOGY ERROR HAPPENS HERE')
				return cb(err);
			}
			cb(null, user);
		});
	});
	/**
		Universal handlers for external auth
	*/
	// Primary auth request
	app.get(apiUrl + 'auth/in',
		function(req, res, next) {
			passport.authenticate(req.query.provider)(req, res, next);
			// здесь можно передать объект с доп. permissions
			// пример для vkontakte:
			// { scope: ['status', 'email', 'friends', 'notify'] }
			// см. https://www.npmjs.com/package/passport-vkontakte#extended-permissions
			// и https://vk.com/dev/permissions
		});

	// Secondary (callback) auth request
	var extLoginCb = _api.path + 'auth/external-callback';
	var extLoginCb_full = _api.domain + extLoginCb;
	app.get(extLoginCb,
		function(req, res, next) {
			passport.authenticate(req.query.provider, {
				failureFlash: true
			})(req, res, next);
		},
		function(req, res) {
			var usr = JSON.stringify(req.user);
			res
				.status(200)
				.send(`<script>
					window.opener._handleLogonSuccess(${usr});
					window.close();
					</script>`)
				.end();
		});

	/** 
		Local auth
		http://passportjs.org/docs/username-password
	*/
	var resultUrl = apiUrl + 'auth/result';
	// local login: same url but different method (POST instead of GET)
	app.post(apiUrl + 'auth/in',
		passport.authenticate('local', {
			successRedirect: resultUrl,
			failureRedirect: resultUrl
		})
	);
	app.get(resultUrl, function(req, res) {
		if (req.user) {
			req.user.pwd = '<NO>';
		}
		res.json({
			currentUser: req.user
		});
	});
	passport.use(new LocalStrategy(
		function(email, password, done) {
			dbtools.getDb().collection(C_USERS).findOne({
				email: email
			}, function(err, user) {
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
	/**
		Twitter auth
		https://www.npmjs.com/package/passport-twitter
	*/
	passport.use(new TwitterStrategy({
			consumerKey: CONF.get().twitter_consumer_key,
			consumerSecret: CONF.get().twitter_consumer_secret,
			callbackURL: extLoginCb_full + '?provider=twitter',
		},
		function(token, tokenSecret, profile, done) {
			var newUser = {
				twitter_id: profile.id,
				name: profile.displayName,
				pic: profile.photos[0].value
			};
			dbtools.getDb().collection(C_USERS).findAndModify({
					twitter_id: profile.id
				}, [] // sort				
				, {
					$setOnInsert: newUser
				}, {
					new: true, // return new doc if one is upserted
					upsert: true // insert the document if it does not exist
				},
				function(err, dbres) {
					return done(err, dbres ? dbres.value : null);
				})
		}
	));
	/**
		Facebook auth
		https://www.npmjs.com/package/passport-facebook
	*/
	passport.use(new FacebookStrategy({
			clientID: CONF.get().facebook_app_id,
			clientSecret: CONF.get().facebook_app_secret,
			callbackURL: extLoginCb_full + '?provider=facebook',
			profileFields: ['id', 'displayName', 'name', 'picture.type(large)']
		},
		function(accessToken, refreshToken, profile, done) {
			var newUser = {
				facebook_id: profile.id,
				name: profile.displayName,
				pic: profile.photos[0].value
			};
			dbtools.getDb().collection(C_USERS).findAndModify({
					facebook_id: profile.id
				}, [] // sort
				, {
					$setOnInsert: newUser
				}, {
					new: true, // return new doc if one is upserted
					upsert: true // insert the document if it does not exist
				},
				function(err, dbres) {
					return done(err, dbres ? dbres.value : null);
				})
		}
	));
	/**
		Vkontakte auth
		https://www.npmjs.com/package/passport-vkontakte
	*/
	passport.use(new VKontakteStrategy({
			clientID: CONF.get().vkontakte_app_id,
			clientSecret: CONF.get().vkontakte_app_secret,
			callbackURL: extLoginCb_full + '?provider=vkontakte',
			profileFields: ['photo_max', 'bdate']
				// https://vk.com/dev/objects/user
				// https://vk.com/dev/objects/user_2
		},
		function(accessToken, refreshToken, params, profile, done) {
			var vkUser = profile._json;
			var newUser = {
				vkontakte_id: profile.id,
				name: profile.displayName,
				pic: vkUser.photo_max || vkUser.photo
			};

			if (typeof profile.birthday === 'string') {
				// new Date('1961-04-12') !== new Date(1961,03,12)
				// difference is timezone
				var bd = profile.birthday.split('-');
				if (bd.length === 3) {
					var month = (bd[1] | 0) - 1;
					newUser.bdate = new Date(bd[0], month, bd[2]);
				}
			}
			//console.log(profile)
			dbtools.getDb().collection(C_USERS).findAndModify({
					vk_id: profile.id
				}, [] // sort
				, {
					$setOnInsert: newUser
				}, {
					new: true, // return new doc if one is upserted
					upsert: true // insert the document if it does not exist
				},
				function(err, dbres) {
					return done(err, dbres ? dbres.value : null);
				})
		}));
	/**
		Log out
	*/
	app.post(apiUrl + 'auth/out', function(req, res) {
		req.logout();
		res.redirect(resultUrl);
	});
	/**
		Edit profile
	*/
	app.post(apiUrl + 'auth/edit', function(req, res) {
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
			}, function(err, cmdres) {
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
	const bcrypt = require('bcryptjs'); 
	// this lib is slower (about 30%) but compatible with latest version of nodejs
	// bcrypt does not because of node-gyp
	// api seems to be the same so hot replacement is available :)
	const saltRounds = 8;

	app.post(apiUrl + 'auth/reg', function(req, res) {
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
			function(next) {
				db.collection(C_USERS).find({
					email: req.body.email
				}).toArray(function(err, docs) {
					//console.log(err || docs.length !== 0)
					var fail = err || docs.length !== 0;
					next(err || docs.length !== 0 ? 'User with speciafied email already exists' : null)
				})
			},
			// Generating pwd hash
			function(next) { // TODOOOOO
				//console.log('bcrypt.hash', arguments)
				bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
					newUser.pwd = hash;
					next();
				});
			},
			// Inserting user
			function(next) {
				db.collection(C_USERS)
					.insertOne(newUser, function(err, insert) {
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
				req.login(newUser, function(err) {
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
	/*
		errObjOrStr - error to display in server console
		message - error to return in response
	*/
	var reason = !!errObjOrStr && errObjOrStr.message ? errObjOrStr.message : errObjOrStr; // sweet jesus
	reason = JSON.stringify(reason);
	if (reason === '"Topology was destroyed"') { // when dev server is running too long =)
		dbtools.connect(); // restoring connection
	}
	console.log('API ERROR: ' + reason);
	res.status(code || 500).json({
		error: message
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