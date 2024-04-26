import { useEffect } from "react";
import io from "socket.io-client";
import { useGlobalContext } from "./context/Context";

export const socket = io("http://localhost:5000");

const Socket = () => {
  const {
    setUserId,
    setOnlineUsers,
    setIsConnected,
    tags,
    isSearching,
    setIsSearching,
    setMatchedUser,
    setMessages,
    setRemovedTags,
  } = useGlobalContext();

  useEffect(() => {
    socket.connect();
    console.log("socket connected");

    return () => {
      socket.disconnect();
      console.log("socket disconnected");
    };
  }, []);
  useEffect(() => {
    socket.on("user-id", (userID) => {
      setUserId(userID);
    });
  }, []);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      setUserId(socket.id);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [setIsConnected, setUserId]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("get-online-users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("get-online-users");
    };
  }, [setOnlineUsers]);

  useEffect(() => {
    if (isSearching) {
      socket.emit("update-tags", tags);
      socket.emit("user-searching");
    }
  }, [isSearching]);

  useEffect(() => {
    socket.on("match-found", (user) => {
      console.log("Matchfound lo esta poniendo en false");
      setIsSearching(false);
      setMatchedUser(user);
      setRemovedTags(false);
      console.log("User matched", user);
    });

    return () => {
      socket.off("user_matched");
    };
  }, [setMatchedUser]);
  useEffect(() => {
    socket.on("match-not-found", () => {
      console.log("Match not found lo esta poniendo en false");
      setIsSearching(false);
      setRemovedTags(false);
      console.log("No user found");
    });

    return () => {
      socket.off("match-not-found");
    };
  });

  useEffect(() => {
    socket.on("receive-message", (messageData) => {
      console.log("Mensaje recibido:", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]); // Agrega el nuevo mensaje al estado existente
    });

    return () => {
      socket.off("receive-message");
    };
  }, [setMessages]);
};

export default Socket;
