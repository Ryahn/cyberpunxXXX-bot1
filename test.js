const fs = require('fs')
let whitelist = JSON.parse(fs.readFileSync("./sent_messages.json"));

console.log(whitelist["72884988374167552"]?.id)

delete whitelist["72884988374167552"];

fs.writeFileSync("./sent_messages.json", JSON.stringify(whitelist, null, 4), 'utf8');