import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
const Context = createContext();

const ContextProvider = ({ children }) => {
  const [userId, setUserId] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [tags, setTags] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [removedTags, setRemovedTags] = useState(false);
  const [partnerDisconnected, setPartnerDisconnected] = useState(false);

  const resetStates = () => {
    setMatchedUser(null);
    setIsSearching(false);
    setMessages([]);
    setPartnerDisconnected(false);
    setRemovedTags(false);
  };
  return (
    <>
      <Context.Provider
        value={{
          userId,
          setUserId,
          onlineUsers,
          setOnlineUsers,
          isConnected,
          setIsConnected,
          tags,
          setTags,
          matchedUser,
          setMatchedUser,
          isSearching,
          setIsSearching,
          message,
          setMessage,
          messages,
          setMessages,
          removedTags,
          setRemovedTags,
          partnerDisconnected,
          setPartnerDisconnected,
          resetStates,
        }}
      >
        {children}
      </Context.Provider>
    </>
  );
};

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useGlobalContext = () => useContext(Context);

export { Context, ContextProvider, useGlobalContext };
