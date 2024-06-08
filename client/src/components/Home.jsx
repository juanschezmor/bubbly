import logo from "../assets/logo.png";
import PropTypes from "prop-types";
import { APP_DESCRIPTION, TAGS_DESCRIPTION, TAGS_STRING } from "../constants";
function Home({
  tags,
  inputValue,
  handleInputChange,
  handleAddTag,
  handleRemoveTag,
  tagsDisabled,
  startChatting,
}) {
  return (
    <>
      <div className=" hidden md:flex screen">
        <div className="main-container flex flex-col pb-5">
          <div className="w-full h-full flex  justify-center items-center">
            <div className="w-full flex flex-col items-center">
              <img
                className="rounded-full w-5/6 h-auto"
                src={logo}
                alt="Logo"
              />
            </div>
            <div className="pb-5"></div>
            <div className="pb-5 text-xl">
              <p dangerouslySetInnerHTML={{ __html: APP_DESCRIPTION }} />
              <br />
              <p dangerouslySetInnerHTML={{ __html: TAGS_DESCRIPTION }} />
            </div>
          </div>
          <div className="w-full h-full flex  items-center justify-center p-10">
            <div className="w-1/2 h-full justify-center text-center ">
              <div className="instructions">
                <h3>Instructions</h3>
                <ul className="text-left">
                  <li>
                    1.Add tags that you wish to have in common with your match
                  </li>
                  <li>2.Click on &quot;Start Chatting!&quot;</li>
                </ul>
              </div>
            </div>
            <div className="tags w-1/2 h-1/4 flex flex-col justify-center items-center">
              <p className="">{TAGS_STRING}</p>
              <div className="flex items-center justify-center">
                <input
                  className="input-tags"
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddTag();
                    }
                  }}
                />
                <button
                  className="add-tag-btn ml-2"
                  onClick={handleAddTag}
                  disabled={tagsDisabled}
                >
                  <p className="add-text">Add</p>
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
          </div>
          <div className="w-full flex justify-center items-center">
            <button className="boton" onClick={startChatting}>
              Start Chatting!
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

Home.propTypes = {
  tags: PropTypes.array,
  inputValue: PropTypes.string,
  handleInputChange: PropTypes.func,
  handleAddTag: PropTypes.func,
  handleRemoveTag: PropTypes.func,
  startChatting: PropTypes.func,
  tagsDisabled: PropTypes.bool,
};
export default Home;
