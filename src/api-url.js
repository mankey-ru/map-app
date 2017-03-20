// Handling a case when app is built for Cordova, 
// therefore api becomes remote
// see also api-setup

// this code is being executed as server-side node script (i.e. api-setup)
var isServerSide = typeof document === 'undefined';

// running app contains only client code (api is remote)
var isStandaloneApp = isServerSide===false && document.URL.indexOf('http') !== 0;

// running app contains both server and client code
var isWebsite = isServerSide===false && document.URL.indexOf('http') === 0;

var remoteDomain = 'https://mapp-app.herokuapp.com'; // todo get from config
var localDomain = 'http://localhost:8082'; // todo get from config
var isDev = process && process.env.NODE_ENV==='development';
var domain = isDev ? localDomain : remoteDomain;

var basePath = '/api/';

module.exports = {
	def: isWebsite ? basePath : remoteDomain + basePath,
	path: basePath,
	domain
};