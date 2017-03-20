// Credits to http://lollyrock.com/articles/nodejs-encryption/
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';

const password_key = 'MAPP_CRYPTO_KEY';
const password = process.env[password_key];
if (!password || password.length < 8) {
	throw new Error(`\n\n\n    Please create environment variable ${password_key} containing your new 8-character password \n\n\n`)
}

const fs = require('fs');
const path = require('path');

const path_blank = path.join(__dirname, './config.blank.js');
const path_backup = path.join(__dirname, './config.backup.js');
const path_encrypted = path.join(__dirname, './config.encrypted.js');

module.exports = {
	get: getConf,
	path_blank
};

var confCache;

function getConf() {
	if (!fs.existsSync(path_encrypted)) {
		console.log(`\n\n   Config file ${path_encrypted} not found and now will be generated from "blank" config\n`)
		compile(getConf);
	}
	if (!confCache) {
		var settCrypt = require(path_encrypted)
		confCache = {};
		for (var k in settCrypt) {
			if (settCrypt[k]) {
				confCache[k] = decrypt(settCrypt[k]);
			}
		}
	}
	return confCache
}

function compile() {
	/**
		What does this script do:
		1. read config from config.blank.js
		2. encrypt it
		3. write encrypted config to config.encrypted.js
		4. write blank config to config.blank.js again
	*/

	var sett = require(path_blank);

	fs.writeFileSync(path_backup, getFileContents(sett));
	console.log(`   Your raw config data is backed up to UNTRACKED file ${path_blank}`);

	var settCrypt = {};
	for (var k in sett) {
		if (sett[k]) {
			settCrypt[k] = encrypt(sett[k]);
			sett[k] = '';
		}
	}

	fs.writeFileSync(path_encrypted, getFileContents(settCrypt));
	console.log(`   Your encrypted config is ready to be commited to a public repo. Path is ${path_encrypted}`);

	fs.writeFileSync(path_blank, getFileContents(sett));
	console.log(`   Your "blank" config you've just filled in is blank again and safe`);

	console.log('\n')
}

function getFileContents(obj) {
	var str = JSON.stringify(obj, null, 2);
	return `module.exports = ${str}`
}

function encrypt(text) {
	var cipher = crypto.createCipher(algorithm, password)
	var crypted = cipher.update(text, 'utf8', 'hex')
	crypted += cipher.final('hex');
	return crypted;
}

function decrypt(text) {
	var decipher = crypto.createDecipher(algorithm, password)
	var dec = decipher.update(text, 'hex', 'utf8')
	dec += decipher.final('utf8');
	return dec;
}