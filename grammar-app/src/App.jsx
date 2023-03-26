import "./styles.css";
import { useForm } from "./hooks/useForm";
import { ChatStripe } from "./components/ChatStripe";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useRef, useState } from "react";

const inputPrompt = {
  prompt: "",
};

function App() {
  const { prompt, onInputChange, onResetForm } = useForm(inputPrompt);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const botMessage = {
      isAi: true,
      value:
        "¡Hola! Soy Grammify, tu asistente virtual para mejorar tu gramática en inglés y también puedo ayudarte a traducir al inglés. ¡Escríbeme cualquier duda que tengas y trabajaremos juntos para mejorar tu inglés!",
      uniqueId: uuidv4(),
    };

    setMessages([botMessage]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let uniqueId = uuidv4();

    const newMessage = {
      isAi: false,
      value: prompt,
      uniqueId,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    onResetForm();

    const response = await fetch("http://localhost:5000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const parsedData = data.bot.trim();

      uniqueId = uuidv4();

      const botMessage = {
        isAi: true,
        value: parsedData,
        uniqueId,
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } else {
      const err = await response.text();

      uniqueId = uuidv4();

      const botMessage = {
        isAi: true,
        value: "Something went wrong",
        uniqueId,
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);

      alert(err);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div id="chat_container" ref={chatContainerRef}>
        {messages.map((message) => {
          return <ChatStripe key={message.uniqueId} {...message} />;
        })}
        {isLoading && (
          <div className="wrapper ai">
            <div className="chat">
              <div className="profile">
                <img src="/public/assets/bot.svg" alt="bot" />
              </div>
              <div className="message" id={uuidv4()}>
                ...
              </div>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          name="prompt"
          value={prompt}
          onChange={onInputChange}
          rows="1"
          cols="1"
          placeholder="Escribe aquí tu texto..."
        ></textarea>
        <button type="submit">
          <img src={"/public/assets/send.svg"} />
        </button>
      </form>
    </>
  );
}

export default App;
