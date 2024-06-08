import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/Context";
import { WEB_NAME } from "../constants";
import logo from "../assets/logo.png";
import ColorModal from "./ColorModal";

function Header() {
  const navigate = useNavigate();
  const { onlineUsers, userId, changeColorScheme } = useGlobalContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openColorModal = () => {
    setIsModalOpen(true);
  };

  const closeColorModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    console.log(userId);
    console.log(onlineUsers);
  }, [onlineUsers, userId]);

  return (
    <header className="flex top-0 left-0 w-full z-50 flex-col md:flex-row items-center justify-between p-4 bg-[var(--background-color2)]">
      <div className="flex items-center mb-2 md:mb-0">
        <a
          className="flex items-center justify-between cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img className="rounded-full w-6 h-6 md:mr-2" src={logo} alt="logo" />

          <h1 className="text-lg font-semibold">{WEB_NAME}</h1>
        </a>
      </div>
      <div className="flex flex-col md:flex-row items-center">
        <a onClick={openColorModal} className="change-color-btn mr-3">
          Change color
        </a>
        <p>Online users: {onlineUsers && onlineUsers.length}</p>
      </div>
      <ColorModal
        isOpen={isModalOpen}
        onClose={closeColorModal}
        changeColorScheme={changeColorScheme}
      />
    </header>
  );
}

export default Header;
