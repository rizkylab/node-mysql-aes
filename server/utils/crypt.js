require("dotenv").config()

function encrypt (text) {
    return `HEX(AES_ENCRYPT('${text}', '${process.env.APP_KEY}'))`
}

function decrypt (text, alias) {
    return `AES_DECRYPT(UNHEX(${text}), '${process.env.APP_KEY}') as ${alias ? alias : text}`
}

module.exports = {
    encrypt,
    decrypt
}