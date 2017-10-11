Keywords
=========
- Vue.js (vue-router, vuex)
- Webpack (HMR, Babel, Less, build-time bundle gzip, bundle analyzer)
- Quasar Framework
- Local (bcrypt) and social (Facebook, Vk, Twitter) authentication types
- Cordova
- ElectronJS
- ExpressJS
- MongoDB
- [crypto](https://github.com/brix/crypto-js) (all credentials like database url and api keys are encrypted with AES-256-CTR)
- [Heroku](https://www.heroku.com/) (hosting binded to this repo)
- [MongoLab](https://mlab.com/) (remote DB)
- [Cloudinary](https://cloudinary.com/) (remote image storage)

App is as much universal as it possible at all
=========
- it has both client- and server-side
- it works in browser
- it works on all modile platforms (ready to build with Cordova)
- in works on all desktop platforms (ready to build with ElectronJS)

Commands
=========

General
--------
```javascript
npm run dev		// run webpack dev server with HMR
run run dev0	// run nodemon with npm dev (useful for editing api-setup.js)
npm run build	// build client-side bundle (*.js-compressed.gz for web; *.js for Cordova and Electron)
npm start		// run as server. Required by Heroku.
```

Cordova-related
--------
run
```bash
cordova run android --device
```
windows script to build android app (before that you should build the bundle via "npm run build")
```bash
call cordova build android
cd platforms\android\build\outputs\apk
call adb install -r android-debug.apk
```

Electron-related
--------
Windows script to build windows app (before that you should build the bundle via "npm run build")
```bash
cd electron
call quasar build win32
explorer "%cd%\dist\MappApp-win32-x64"
```

Global modules (optional)
--------
```bash
# this one is for convenient debugging of server-side code (api-setup.js)
npm i -g nodemon
# this one needs admin rights to be executed
npm i -g windows-build-tools --add-python-to-path
```

# Major TODOs
- replace homebrewed server validation with plugin like [express-validation](https://www.npmjs.com/package/express-validation) or [express-validator](https://www.npmjs.com/package/express-validator)
- unit testing (i.e. [mocha](https://mochajs.org/) or [chai](http://chaijs.com/))
- Vue testing (i.e. [avoriaz](https://github.com/eddyerburgh/avoria))
- logger (i.e. [bunyan](https://github.com/trentm/node-bunyan))