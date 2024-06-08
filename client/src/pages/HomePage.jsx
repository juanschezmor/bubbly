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
  const [tagsDisabled, setTagsDisabled] = useState(false);
  const handleAddTag = () => {
    let tag = inputValue.trim();
    if (tag !== "") {
      if (tag.length > 10) {
        alert("You can't add a tag with more than 10 characters!");
        setTagsDisabled(true);
      } else {
        if (tags.length >= 10) {
          setTagsDisabled(true);
          alert("You can't add more than 10 tags!");
        } else {
          setTags((prevTags) => [...prevTags, inputValue.trim()]);
          setInputValue("");
        }
      }
    }
  };
  const handleRemoveTag = (indexToRemove) => {
    setTags((prevTags) =>
      prevTags.filter((_, index) => index !== indexToRemove)
    );
    if (tags.length <= 10) {
      setTagsDisabled(false);
    }
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

  return (
    <>
      <Home
        {...{
          tags,
          inputValue,
          handleInputChange,
          handleAddTag,
          handleRemoveTag,
          tagsDisabled,
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
          tagsDisabled,
          startChatting,
        }}
      />
    </>
  );
}

export default HomePage;
