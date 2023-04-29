import './normal.css';
import './App.css';
import { useEffect, useState } from 'react';
import Chat from './components/chat';

function App() {

  useEffect(() => {
    getEngines();
  }, []);

  const [input, setInput] = useState("");
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState("ada");
  const [chatLog, setChatLog] = useState([{
    user: "gpt",
    message: "What's up?"
  }, {
    user: "Me",
    message: "Feeling good!"
  }]);

  function clearChat() {
    setChatLog([]);
  };

function getEngines() {
  fetch("http://localhost:3080/models")
  .then(res => res.json())
  .then(data => {
    setModels(data.models.data)
  })
}

async function handleSubmit(e) {
  e.preventDefault();
  
  let chatLogNew = [...chatLog, {user: 'me', message: `${input}`}]
  setInput("");
  setChatLog(chatLogNew);

  const messages = chatLogNew.map((message) => message.message).join("\n")

  const response = await fetch("http://localhost:3080/", {
    method: "POST",
    headers: {
      "Content-Type": "application/JSON"
    },
    body: JSON.stringify({
      message: messages,
      currentModel,
    })
  });
  const data = await response.json();
  setChatLog([...chatLogNew, { user: "gpt", message: `${data.message}`}]);
  console.log(data.message);
}

  return (
    <div className="App">
      <aside className='sidemenu'>
        <div className='side-menu-button' onClick={clearChat}>
          <span>+</span>
          New Chat
        </div>
        <div className='models'>
          <select onChange={(e) => setCurrentModel(e.target.value)}>
            {models.map((model) => (
              <option key={model.id} value={model.id}>{model.id}
              </option>
            ))}
          </select>
        </div>
      </aside>
      <section className='chatbox'>
        <div className='chat-log'>
          
         {chatLog.map((message, index) => (
         <Chat key={index} message={message}/>
         ))} 
        </div>
        <div className='chat-input-holder'> 
          <form onSubmit={handleSubmit}>
          <input type='text' 
          className='chat-input-text' 
          value={input} 
          onChange={(e) => setInput(e.target.value)}>
          </input>
          <button onClick={handleSubmit}><svg
    xmlns="http://www.w3.org/2000/svg"
    // xmlSpace="preserve"
    width={60}
    height={60}
    fill="#49414f"
    stroke="#49414f"
    strokeWidth={26.624}
    viewBox="-179.2 -179.2 870.4 870.4"
  >
    <rect
      width={870.4}
      height={870.4}
      x={-179.2}
      y={-179.2}
      fill="#343541"
      stroke="none"
      strokeWidth={0}
      rx={435.2}
      transform="matrix(.95 0 0 .95 12.8 12.8)"
    />
    <path d="M508.645 18.449a10.436 10.436 0 0 0-10.826-2.085L6.715 204.446a10.443 10.443 0 0 0-6.607 8.264 10.446 10.446 0 0 0 3.995 9.796L156.23 339.253c-.004.116-.575.224-.575.342v83.592c0 3.851 2.663 7.393 6.061 9.213 1.541.827 3.51 1.236 5.199 1.236 2.026 0 4.181-.593 5.931-1.756l56.12-37.367 130.369 99.669a10.492 10.492 0 0 0 9.613 1.633 10.451 10.451 0 0 0 6.786-6.974L511.571 29.082a10.45 10.45 0 0 0-2.926-10.633zM170.506 321.508c-.385.36-.7.763-1.019 1.163L31.659 217.272 456.525 54.557 170.506 321.508zm6.046 82.153v-48.454l33.852 25.887-33.852 22.567zm183.444 64.693-121.63-93.012a10.397 10.397 0 0 0-4.883-3.733l-47.29-36.163L480.392 60.86 359.996 468.354z" />
  </svg></button>
          </form>
        </div>
      </section>
      
    </div>
  );
}

export default App;
