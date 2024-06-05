import logo from "../assets/logo.png";
import PropTypes from "prop-types";
import {
  WEB_NAME,
  APP_DESCRIPTION,
  TAGS_DESCRIPTION,
  TAGS_STRING,
} from "../constants";
function Home({
  tags,
  inputValue,
  handleInputChange,
  handleAddTag,
  handleRemoveTag,
  startChatting,
}) {
  return (
    <>
      <div className=" hidden md:flex screen">
        <div className="main-container flex flex-row">
          <div className="w-1/2 h-full flex flex-col justify-center items-center p-3">
            <div className="w-full max-h-36 flex p-2 items-center">
              <img
                className="rounded-full w-1/3 h-auto"
                src={logo}
                alt="Logo"
              />
              <h2 className="text-5xl">{WEB_NAME}</h2>
            </div>
            <div className="pb-5"></div>
            <div className="pb-5 text-xl">
              <p dangerouslySetInnerHTML={{ __html: APP_DESCRIPTION }} />
              <br />
              <p dangerouslySetInnerHTML={{ __html: TAGS_DESCRIPTION }} />
            </div>
          </div>
          <div className="w-1/2 h-full flex flex-col items-center justify-center p-10">
            <div className="tags w-full h-1/4 flex flex-col justify-center items-center">
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
                <button className="add-tag-btn ml-2" onClick={handleAddTag}>
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
            <div>
              <button className="boton" onClick={startChatting}>
                Start Chatting!
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
//Prop validation
Home.propTypes = {
  tags: PropTypes.array,
  inputValue: PropTypes.string,
  handleInputChange: PropTypes.func,
  handleAddTag: PropTypes.func,
  handleRemoveTag: PropTypes.func,
  startChatting: PropTypes.func,
};
export default Home;
