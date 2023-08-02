const Hyperswarm = require('hyperswarm');
const goodbye = require('graceful-goodbye');
const crypto = require('crypto');
const b4a = require('b4a');
const cors = require('cors');
const bodyParser = require('body-parser');

const swarm = new Hyperswarm()
goodbye(() => swarm.destroy())

const express = require('express')
const app = express()
const port = 5000

// middleware
app.use(cors());
app.use(bodyParser.json());

// Keep track of all connections and console.log incoming data
const conns = []

const messages = []

swarm.on('connection', conn => {
  const name = b4a.toString(conn.remotePublicKey, 'hex')
  console.log('* got a connection from:', name, '*')
  conns.push(conn)
  conn.once('close', () => conns.splice(conns.indexOf(conn), 1))
  conn.on('data', data => {messages.push(`${name}: ${data}`); console.log(`${name}: ${data}`);})
})


app.get('/getmessages', (req,res) => {
  res.json({"messages":messages})
})

// Broadcast stdin to all connections
// process.stdin.on('data', d => {
//   for (const conn of conns) {
//     conn.write(d)
//   }
// })

app.post("/send", (req,res) => {
  for (const conn of conns) {
    conn.write(req.body.message)
    console.log("Message sent:",req.body.message)
  }
})

app.post("/connect", (req,res) => {
  // Join a common topic
  const topic = req.body.topic ? b4a.from(req.body.topic, 'hex') : crypto.randomBytes(32)
  const discovery = swarm.join(topic, { client: true, server: true })

  // The flushed promise will resolve when the topic has been fully announced to the DHT
  discovery.flushed().then(() => {
  console.log('joined topic:', b4a.toString(topic, 'hex'))
  })

  res.json({"connected":true, "topic":b4a.from(req.body.topic, 'hex')});
})

// // Join a common topic
// const topic = process.argv[2] ? b4a.from(process.argv[2], 'hex') : crypto.randomBytes(32)
// const discovery = swarm.join(topic, { client: true, server: true })

// // The flushed promise will resolve when the topic has been fully announced to the DHT
// discovery.flushed().then(() => {
//   console.log('joined topic:', b4a.toString(topic, 'hex'))
// })

app.listen(5000, () => {
  console.log("Server started on port 5000")
})