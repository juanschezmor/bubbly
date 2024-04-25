import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useGlobalContext } from "../context/Context";

function Header() {
  const navigate = useNavigate();
  const navigateTo = (path) => {
    navigate(path);
  };
  const { onlineUsers, userId } = useGlobalContext();

  useEffect(() => {
    console.log(userId);
    console.log(onlineUsers);
  }, [onlineUsers, userId]);

  return (
    <header className="flex items-center justify-between p-4 bg-[var(--background-color2)]">
      <div className="flex items-center">
        {/* Icono de la aplicación */}
        <a
          className="flex items-center justify-between cursor-pointer"
          onClick={() => navigateTo("/")}
        >
          <img className="rounded-full w-6 h-6 mr-2" src={logo} alt="logo" />
          {/* Nombre de la aplicación */}
          <h1 className="text-lg font-semibold">NombreApp</h1>
        </a>
      </div>
      <p>User: {userId}</p>
      {/* Otros elementos del header, como botones de navegación, se pueden agregar aquí */}
      <p>Online users: {onlineUsers && onlineUsers.length}</p>
    </header>
  );
}

export default Header;
