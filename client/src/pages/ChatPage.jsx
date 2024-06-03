import { useEffect } from "react";
import { useGlobalContext } from "../context/Context";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import Chat from "../components/Chat";
import ChatMobile from "../components/ChatMobile";
function ChatPage() {
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
  // When matchedUser changes and it's null, exit
  useEffect(() => {
    if (matchedUser == null && !isSearching) {
      handleExit();
    }
  }, [matchedUser]);

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
      <ChatMobile
        {...{
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
        }}
      />
      <Chat
        {...{
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
        }}
      />
    </>
  );
}

export default ChatPage;
