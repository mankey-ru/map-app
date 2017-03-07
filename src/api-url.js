// Handling a case when app is built for Cordova, therefore api becomes remote
// see also api-setup
var isWeb = typeof document === 'undefined' || document.URL.indexOf('http') === 0;
module.exports = isWeb ? '/api/' : 'https://map-app-.herokuapp.com/api/';