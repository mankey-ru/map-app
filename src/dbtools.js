const mongodb = require("mongodb");
const CONF = require('./conf/conf.js');
const db_uri = CONF.get().db_uri;

if (!db_uri) {
	throw new Error(`\n\n\n\n   App initialization failed. Please specify db_uri in ${CONF.path_blank} then re-run app again\n\n\n\n`)
	process.exit(1);
}

var _db;
module.exports =  {
	connect: function (callback) {
		mongodb.MongoClient.connect(db_uri, function (err, database) {
			if (err) {
				console.log('DBERRRRRRR')
				console.log(err);
				process.exit(1);
			}
			else {
				console.log(' Database connection established')
			}
			_db = database;
			if (typeof callback === 'function') {
				return callback(err);
			}
		});
	},
	getDb: function () {
		return _db;
	}
};