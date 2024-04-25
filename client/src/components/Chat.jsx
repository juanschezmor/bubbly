import { useEffect } from "react";
import { useGlobalContext } from "../context/Context";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
function Chat() {
  const { isSearching, matchedUser, setMatchedUser, setIsSearching } =
    useGlobalContext();
  const navigate = useNavigate();
  const navigateTo = (path) => {
    navigate(path);
  };
  const handleExit = () => {
    console.log("exitinggg");

    setMatchedUser(null);
    setIsSearching(false);
    navigateTo("/");
    socket.emit("unpair");
    return () => {
      socket.off("pairing-user");
    };
  };

  useEffect(() => {
    console.log(isSearching);
  }, [isSearching]);
  return (
    <>
      <div className="screen flex flex-col">
        <div className="main-container flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
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

          <div className="flex-1 p-4 overflow-y-auto">Mensajes</div>
        </div>

        {/* Entrada de mensaje */}
        <div className="w-full flex items-center p-4 border-t border-gray-200">
          <input
            type="text"
            className="flex-1 h-3/4 mr-2 py-2 px-4 border border-gray-300 rounded-lg focus:outline-none"
            placeholder="Escribe tu mensaje..."
          />
          <button className="boton-enviar px-4 py-2 ">Enviar</button>
        </div>
      </div>
    </>
  );
}

export default Chat;
