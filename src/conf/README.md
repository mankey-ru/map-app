Fresh start
---
1. Create env variable MAPP_CRYPTO_KEY containing your new 8-character password
2. Put your credentials into config.blank.js
3. Run app via "npm run dev" or "npm start"

Script will automatically perform several actions
- generation of a new config.encrypted.js
- flush all credentials from config.blank.js
- backup raw unencryped credentials to config.backup.js. This file is not tracked by git.

Edit
---
Rename config.backup.js to config.blank.js, then edit it, then make _fresh start_ (see above)

TODOs
---
config.backup.js restoration