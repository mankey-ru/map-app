/**
	This is shared constants lib
*/
const _ = require('lodash');

const clientOnly = {

};
const serverOnly = {
	TEXT_SEARCH_LENGTH_THRESHOLD: 4 // below this length search will look for exact words
};
const both = {
	TEXT_SEARCH_LENGTH_MAX: 50
};

module.exports = {
	both,
	cli: clientOnly,
	srv: serverOnly,
	all: _.extend(both, clientOnly, serverOnly)
};