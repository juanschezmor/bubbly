import PropTypes from "prop-types";

function Chat({
  isSearching,
  matchedUser,
  searchNext,
  handleExit,
  message,
  messages,
  removedTags,
  handleMessageChange,
  sendMessage,
  startChattingAgain,
  userId,
  partnerDisconnected,
}) {
  const isChatDisabled = matchedUser === null;

  return (
    <>
      <div className="hidden md:flex screen md:flex-col">
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
          </div>
          {/* Entrada de mensaje */}
          <div className="w-full flex items-center mt-5 p-4 border-t border-gray-200">
            <button
              className="next-btn px-4 py-2 mr-2"
              onClick={searchNext}
              disabled={isSearching || isChatDisabled}
            >
              Next
            </button>
            <input
              type="text"
              className="flex-1 h-3/4 mr-2 py-2 px-4 border border-gray-300 rounded-lg focus:outline-none"
              placeholder="Escribe tu mensaje..."
              value={message}
              onChange={handleMessageChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              disabled={isChatDisabled}
            />
            <button
              className="send-btn px-4 py-2 "
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

Chat.propTypes = {
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
  searchNext: PropTypes.func.isRequired,
};

export default Chat;
