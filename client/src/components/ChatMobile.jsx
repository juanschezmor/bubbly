import PropTypes from "prop-types";
import { useRef, useEffect } from "react";
function ChatMobile({
  isSearching,
  matchedUser,
  handleExit,
  message,
  messages,
  removedTags,
  handleMessageChange,
  sendMessage,
  startChattingAgain,
  userId,
  partnerDisconnected,
  stopSearching,
  typingStatus,
}) {
  const isChatDisabled = matchedUser === null;
  const messageContainerRef = useRef(null);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <div className="screen-mobile flex flex-col md:hidden">
        <div className="main-container-mobile flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
            {isSearching & (matchedUser == null) ? (
              <button
                className="stop-btn px-4 py-2 mr-2"
                onClick={stopSearching}
                disabled={isChatDisabled}
              >
                Stop
              </button>
            ) : null}

            {isSearching & (matchedUser == null) ? (
              <p>Searching for a compy...</p>
            ) : null}

            {(matchedUser != null) & !isSearching ? (
              <div className="flex flex-col items-center">
                <p>Match found!</p>
              </div>
            ) : null}
            <button className="boton" onClick={handleExit}>
              Salir
            </button>
          </div>

          {/* Messages area */}

          <div
            ref={messageContainerRef}
            className="flex-1 p-4 overflow-y-auto "
          >
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
            {!isSearching & (matchedUser == null) & !partnerDisconnected ? (
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
              <div>
                We couldnt find any user that matches your tags, we removed the
                tags to find a user
              </div>
            )}
            {partnerDisconnected && (
              <div>
                <p>
                  Your partner has disconnected, press here if you want to keep
                  trying
                </p>
                <button className="boton" onClick={startChattingAgain}>
                  Start chatting
                </button>
              </div>
            )}
            {typingStatus && <div className="message text-left">Typing...</div>}
          </div>
          {/* Message Input */}
          <div className="w-full flex items-center mt-5 p-4 border-t border-gray-200 ">
            <input
              type="text"
              className="flex-1 h-3/4 mr-2 py-2 px-4 border border-gray-300 rounded-lg focus:outline-none"
              placeholder="Escribe tu mensaje..."
              value={message}
              onChange={handleMessageChange}
              disabled={isChatDisabled}
            />
            <button
              className="boton-enviar px-4 py-2 "
              onClick={sendMessage}
              disabled={isChatDisabled}
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
ChatMobile.propTypes = {
  isSearching: PropTypes.bool.isRequired,
  matchedUser: PropTypes.string,
  handleExit: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  messages: PropTypes.array.isRequired,
  removedTags: PropTypes.bool.isRequired,
  handleMessageChange: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired,
  startChattingAgain: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  partnerDisconnected: PropTypes.bool.isRequired,
  stopSearching: PropTypes.func.isRequired,
  typingStatus: PropTypes.bool,
};

export default ChatMobile;
