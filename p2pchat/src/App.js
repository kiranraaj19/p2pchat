import logo from './logo.svg';
import './App.css';
import {useState,useEffect} from 'react';
import axios from 'axios';

function App() {
  const [topic,setTopic] = useState("");
  const [connected,setConnected] = useState(false);

  const [message, setMessage] = useState("");

  const [chat, setChat] = useState([]);

  const handleConnection = (event) => {
    event.preventDefault();

    fetch('https://p2pchat-api.vercel.app/connect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ topic }),
      })
      .then(
        res => {
          setConnected(true);
        }
      )
  }

  const sendMessage = (event) => {
    event.preventDefault();
    fetch('https://p2pchat-api.vercel.app/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
      })

  }

  useEffect(() => {
      const interval = setInterval(() => {
      axios.get("https://p2pchat-api.vercel.app/getmessages")
      .then(res => {setChat(res.data.messages);console.log(chat)})
      .catch(error => console.log(error))
  }, 3000);
  return () => clearInterval(interval);
}, []);

  return (
    <div className="App">
      <form onSubmit={handleConnection}>
        <label>Connect/Create</label><br/>
        <input onChange={(event)=>setTopic(event.target.value)}/>
        <button>Join</button>
      </form>

      { (connected == false) ? 
        <p>Not connected yet.</p>: 
        <>
        <p>Connected!</p>
      
      {
        chat.map((mes,i) => {
          <p key={i}>
            {mes}
          </p>
        })
      }

      <form onSubmit={sendMessage}>
        Send Message: <input onChange={event => setMessage(event.target.value)}/> <button>Send</button>
      </form>
      </>
    }
    </div>
  );
}

export default App;
