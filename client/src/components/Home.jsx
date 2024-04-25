import { useGlobalContext } from "../context/Context";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const { tags, setTags, setIsSearching } = useGlobalContext();
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddTag = () => {
    let tag = inputValue.trim();
    if (tag !== "") {
      if (tag.length > 10) {
        alert("You can't add a tag with more than 10 characters!");
      } else {
        setTags((prevTags) => [...prevTags, inputValue.trim()]);
        setInputValue("");
      }
    }
  };
  const handleRemoveTag = (indexToRemove) => {
    setTags((prevTags) =>
      prevTags.filter((_, index) => index !== indexToRemove)
    );
  };

  const navigate = useNavigate();
  const navigateTo = (path) => {
    navigate(path);
  };
  const startChatting = () => {
    setIsSearching(true);
    navigateTo("/chat");
  };

  useEffect(() => {
    return () => {
      setIsSearching(false);
    };
  }, [setIsSearching]);

  useEffect(() => {
    console.log(tags);
    if (tags.length > 9) {
      alert("You can't add more than 10 tags!");
    }
  }, [tags]);

  return (
    <>
      <div className="screen">
        <div className="main-container flex flex-row">
          <div className="w-1/2 h-full flex flex-col justify-center items-center p-3">
            <div className="w-full max-h-36 flex p-2 items-center">
              <img
                className="rounded-full w-1/3 h-auto"
                src={logo}
                alt="Logo"
              />
              <h2 className="text-5xl">NombreWeb</h2>
            </div>
            <div className="pb-5"></div>
            <div className="pb-5 text-xl">
              <p>
                <b>NombreApp</b> is an excellent way to make new friends. When
                you use <b>NombreApp</b>, we randomly match you with someone
                else and allow you to chat one-on-one. To ensure your safety,
                chats are anonymous unless you choose to disclose your identity
                (not recommended!), and you have the option to end a chat at any
                time. Please be cautious as predators have been known to use{" "}
                <b>NombreApp</b>
              </p>
              <br />
              <p>
                If you prefer, you can specify your interests, and NombreApp
                will match you with someone who shares similar interests rather
                than a completely random user.
              </p>
            </div>
          </div>
          <div className="w-1/2 h-full flex flex-col items-center justify-evenly p-10">
            <div className="tags w-full h-1/4">
              <p>Etiquetas</p>
              <div className="flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                />
                <button className="boton ml-2 w-36" onClick={handleAddTag}>
                  Add
                </button>
              </div>
              <div className="tags-box">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="tag inline-flex items-center rounded p-2 mr-2 mb-2"
                  >
                    <span>{tag}</span>
                    <button
                      className="ml-2 text-red-500"
                      onClick={() => handleRemoveTag(index)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <button className="boton" onClick={startChatting}>
                Empezar a chatear!
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
