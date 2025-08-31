
const crypto = require('crypto');
console.log({
  JWT_ACCESS_SECRET: crypto.randomBytes(32).toString('hex'),
  JWT_REFRESH_SECRET: crypto.randomBytes(32).toString('hex')
});