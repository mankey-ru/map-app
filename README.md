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
- Heroku

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

# Major TODOs
- replace homebrewed server validation with plugin like [express-validation](https://www.npmjs.com/package/express-validation) or [express-validator](https://www.npmjs.com/package/express-validator)
- general testing https://mochajs.org/
- Vue testing https://github.com/eddyerburgh/avoria
- logger i.e. [bunyan](https://github.com/trentm/node-bunyan)