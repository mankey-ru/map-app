Fresh start
---
1. Create env variable MAPP_CRYPTO_KEY containing your new 8-character password
2. Put your credentials into config.blank.js
3. Run app via "npm run dev" or "npm start"

Script will automatically perform several actions
- generation of a new config.encrypted.js
- flush all credentials from config.blank.js
- backup raw unencryped credentials to config.backup.js. This file is not tracked by git.

How to edit stored credentials
---
# Remove previously generated config.encrypted.js and config.blank.js
# Rename config.backup.js to config.blank.js
# Edit it
# Run app via "npm run dev" or "npm start"

TODOs
---
config.backup.js restoration