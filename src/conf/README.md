Fresh start
---
1. Create env variable MAPP_CRYPTO_KEY containing your new 8-character password on your local machine
2. Create same env variable on your Heroku instance (if any)
3. Put your credentials into `config.blank.js`
4. Run app via `npm run dev`

Script will automatically perform several actions
- generation of a new `config.encrypted.js` - you should commit it
- flush all credentials from `config.blank.js`
- backup raw unencryped credentials to config.backup.js. This file is not tracked by git.

How to edit stored credentials
---
1. Remove previously generated config.encrypted.js and config.blank.js
2. Rename config.backup.js to config.blank.js
3. Edit it
4. Run app via "npm run dev"

TODOs
---
config.backup.js restoration
