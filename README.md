# p2pchat
A Holepunch based p2p chat application

# How to (Locally)
1. Start node server from /server using ` npm run dev `
2. Start react server from /p2pchat using `npm start`
3. Click Join to create a publickey in console
4. Use that console to chat from your cli (peer.mjs can be used to connect to the react instance) `node peer.mjs <remotePublicKey>`
5. Start sending messages from react frontend
6. Messages for react + node instance will be received in console.

Demo: https://drive.google.com/file/d/1OPlKycOoMYgsRdohr9IvCjI1yuxZDt93/view?usp=sharing

# How to (Web: Experimental)

Simplex communication from react to cli (for now).

1. Use cli (peer.mjs) to create topic
2. Enter topic in https://p2pchat-frontend.vercel.app/ and connect with CLI instance
3. Send messages through the website and messages will be reflected in CLI

# Functionalities/To Do
- [X] Connect users by topic
- [X] P2P Communication
- [X] Hyperstore to store messages
- [ ] Reflection of messages in React frontend (Have to fix, temporary fix: console)
- [X] Deployment
