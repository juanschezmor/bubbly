import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/Context";
import { WEB_NAME } from "../constants";
import logo from "../assets/logo.png";

function Header() {
  const navigate = useNavigate();
  const { onlineUsers, userId } = useGlobalContext();

  useEffect(() => {
    console.log(userId);
    console.log(onlineUsers);
  }, [onlineUsers, userId]);

  return (
    <header className="flex fixed top-0 left-0 w-full z-50 flex-col md:flex-row items-center justify-between p-4 bg-[var(--background-color2)]">
      <div className="flex items-center mb-2 md:mb-0">
        {/* Icono de la aplicación */}
        <a
          className="flex items-center justify-between cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img className="rounded-full w-6 h-6 md:mr-2" src={logo} alt="logo" />
          {/* Nombre de la aplicación */}
          <h1 className="text-lg font-semibold">{WEB_NAME}</h1>
        </a>
      </div>
      <div className="flex flex-col md:flex-row items-center">
        <p className="md:mr-4">User: {userId}</p>
        {/* Otros elementos del header, como botones de navegación, se pueden agregar aquí */}
        <p>Online users: {onlineUsers && onlineUsers.length}</p>
      </div>
    </header>
  );
}

export default Header;
