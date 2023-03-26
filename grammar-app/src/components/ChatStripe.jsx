import { useEffect, useState } from "react";
import bot from "/public/assets/bot.svg";
import user from "/public/assets/user.svg";

export const ChatStripe = ({ isAi, value, uniqueId }) => {
    const [typedText, setTypedText] = useState("");
    const [typingSpeed] = useState(50);
  
    useEffect(() => {
      if (isAi) {
        let currentIndex = 0;
        let intervalId = setInterval(() => {
          if (currentIndex <= value.length) {
            setTypedText(value.slice(0, currentIndex));
            currentIndex++;
          } else {
            clearInterval(intervalId);
          }
        }, typingSpeed);
  
        return () => clearInterval(intervalId);
      } else {
        setTypedText(value);
      }
    }, [isAi, value, typingSpeed]);

  return (
    <div className={`wrapper ${isAi ? "ai" : ""}`}>
      <div className="chat">
        <div className="profile">
          <img src={isAi ? bot : user} alt={isAi ? "bot" : "user"} />
        </div>
        <div className="message" id={uniqueId}>
          {typedText}
        </div>
      </div>
    </div>
  );
};
