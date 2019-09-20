const bs58 = require('bs58')

const bytes = Buffer.from('1220f671372efb5e7de90fa7d4e6f890ceae767a0c4e438ab3d80ac72442b431c561', 'hex')
const address = bs58.encode(bytes)
console.log(address)

const address2 = 'Qmevf8axwhts11UN622moN9opay1Yv8DZv2p4aq4nLz3Pe'
const bytes2 = bs58.decode(address2)
console.log("Decoded in HEX: " + bytes2.toString('hex'))
