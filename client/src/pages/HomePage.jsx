import Home from "../components/Home";
import { useGlobalContext } from "../context/Context";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import HomeMobile from "../components/HomeMobile";
function HomePage() {
  const { tags, setTags, setIsSearching, isSearching, resetStates } =
    useGlobalContext();
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
    resetStates();
    setIsSearching(true);
    navigateTo("/chat");
  };

  useEffect(() => {
    console.log("isSearching:", isSearching);
  }, [isSearching]);

  useEffect(() => {
    console.log(tags);
    if (tags.length > 9) {
      alert("You can't add more than 10 tags!");
    }
  }, [tags]);
  return (
    <>
      <Home
        {...{
          tags,
          inputValue,
          handleInputChange,
          handleAddTag,
          handleRemoveTag,
          startChatting,
        }}
      />
      <HomeMobile
        {...{
          tags,
          inputValue,
          handleInputChange,
          handleAddTag,
          handleRemoveTag,
          startChatting,
        }}
      />
    </>
  );
}

export default HomePage;
