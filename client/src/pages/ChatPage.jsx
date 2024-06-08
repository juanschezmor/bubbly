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
    partnerDisconnected,
    setPartnerDisconnected,
    resetStates,
    typingStatus,
    setTypingStatus,
  } = useGlobalContext();
  const navigate = useNavigate();
  const navigateTo = (path) => {
    navigate(path);
  };

  const stopSearching = () => {
    console.log("stopping search");
    resetStates();
    socket.emit("stop-searching");

    socket.off("stop-searching");
  };

  const handleExit = () => {
    console.log("exitinggg");

    stopSearching();
    socket.emit("unpair");
    navigateTo("/");
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

  useEffect(() => {
    //This is what we receive: emit("typing", True, room=partner)
    socket.on("typing", (status) => {
      setTypingStatus(status);
    });
    return () => {
      socket.off("typing");
    };
  }, []);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);

    if (e.target.value) {
      socket.emit("start-typing");
    } else {
      socket.emit("stop-typing");
    }
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
    socket.emit("stop-typing");
  };

  const startChattingAgain = () => {
    setIsSearching(true);
    setRemovedTags(false);
    setMessages([]);
    setPartnerDisconnected(false);
  };
  //Event for partnerDisconnected changes
  useEffect(() => {
    if (partnerDisconnected) {
      console.log("Partner disconnected");
      setMatchedUser(null);
    }
  }, [partnerDisconnected]);

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
          partnerDisconnected,
          stopSearching,
          typingStatus,
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
          partnerDisconnected,
          stopSearching,
          typingStatus,
        }}
      />
    </>
  );
}

export default ChatPage;
