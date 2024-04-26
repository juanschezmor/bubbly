import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/Context";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
function Chat() {
  const {
    isSearching,
    matchedUser,
    setMatchedUser,
    setIsSearching,
    message,
    setMessage,
    messages,
    setMessages,
    userId,
    removedTags,
    setRemovedTags,
  } = useGlobalContext();
  const navigate = useNavigate();
  const navigateTo = (path) => {
    navigate(path);
  };

  const handleExit = () => {
    console.log("exitinggg");

    setMatchedUser(null);
    console.log("Exiting lo esta poniendo en false");
    setIsSearching(false);
    setMessages([]);
    navigateTo("/");
    socket.emit("unpair");
    socket.emit("stop-searching");
    return () => {
      socket.off("pairing-user");
      socket.off("stop-searching");
    };
  };

  useEffect(() => {
    console.log("isSearching:", isSearching);
  }, [isSearching]);

  useEffect(() => {
    const handleRemovedTags = () => {
      console.log("Removed tags");
      setRemovedTags(true);
    };

    socket.on("removed-tags", handleRemovedTags);

    return () => {
      socket.off("removed-tags", handleRemovedTags);
    };
  }, [setRemovedTags]);
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = () => {
    if (message.trim() === "") return;

    const messageData = {
      from: userId,
      to: matchedUser,
      text: message,
    };
    socket.emit("send-message", messageData);
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setMessage("");
  };

  const startChattingAgain = () => {
    setIsSearching(true);
    setRemovedTags(false);
    setMessages([]);

    socket.emit("user-searching");
  };

  return (
    <>
      <div className="screen flex flex-col">
        <div className="main-container flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
            <p>Is searching: {isSearching ? "True" : "False"}</p>

            {isSearching & (matchedUser == null) ? (
              <p>Searching for a compy...</p>
            ) : null}

            {(matchedUser != null) & !isSearching ? (
              <div className="flex flex-col items-center">
                <p>Match found!</p>
                <p>{matchedUser}</p>
              </div>
            ) : null}
            <button className="boton" onClick={handleExit}>
              Salir
            </button>
          </div>

          {/* Área de mensajes */}

          <div className="flex-1 p-4 overflow-y-auto">
            {!isSearching & (matchedUser == null) ? (
              <div>
                <p>
                  We couldnt find a match, press here if you want to keep trying
                </p>
                <button className="boton" onClick={startChattingAgain}>
                  Start chatting
                </button>
              </div>
            ) : null}
            {removedTags && (
              <div className="removed-tags-message">
                We couldnt find any user that matches your tags, we removed the
                tags to find a user
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.from === userId ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={` rounded-lg p-3 mb-2 inline-block ${
                    message.from === userId ? "message-you" : "message-other"
                  }`}
                >
                  <p className="text-sm font-semibold">
                    {message.from === userId ? "You" : "Other"}
                  </p>
                  <p className="text-lg">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Entrada de mensaje */}
        <div className="w-full flex items-center p-4 border-t border-gray-200">
          <input
            type="text"
            className="flex-1 h-3/4 mr-2 py-2 px-4 border border-gray-300 rounded-lg focus:outline-none"
            placeholder="Escribe tu mensaje..."
            value={message}
            onChange={handleMessageChange}
          />
          <button className="boton-enviar px-4 py-2 " onClick={sendMessage}>
            Enviar
          </button>
        </div>
      </div>
    </>
  );
}

export default Chat;
