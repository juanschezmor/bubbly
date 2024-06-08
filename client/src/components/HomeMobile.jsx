import PropTypes from "prop-types";
import logo from "../assets/logo.png";
import {
  WEB_NAME,
  APP_DESCRIPTION,
  TAGS_DESCRIPTION,
  TAGS_STRING,
} from "../constants";

function HomeMobile({
  tags,
  inputValue,
  handleInputChange,
  handleAddTag,
  handleRemoveTag,
  tagsDisabled,
  startChatting,
}) {
  return (
    <div className="screen-mobile md:hidden">
      <div className="main-container-mobile flex flex-col justify-center items-center p-3">
        <div className="max-h-36 flex p-2 items-center">
          <img className="rounded-full w-1/3 h-auto" src={logo} alt="Logo" />
          <h2 className="text-5xl">{WEB_NAME}</h2>
        </div>
        <div className="pb-5"></div>
        <div className="pb-5 text-xl">
          <p dangerouslySetInnerHTML={{ __html: APP_DESCRIPTION }} />
          <br />
          <p dangerouslySetInnerHTML={{ __html: TAGS_DESCRIPTION }} />
        </div>
        <div className="tags w-full">
          <p>{TAGS_STRING}</p>
          <div className="flex items-center">
            <input
              className="input-tags h-6"
              type="text"
              value={inputValue}
              onChange={handleInputChange}
            />
            <button
              className="add-tag-btn ml-2 w-36"
              onClick={handleAddTag}
              disabled={tagsDisabled}
            >
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
        <button className="boton my-10" onClick={startChatting}>
          Start Chatting!
        </button>
      </div>
    </div>
  );
}
HomeMobile.propTypes = {
  tags: PropTypes.array,
  inputValue: PropTypes.string,
  handleInputChange: PropTypes.func,
  handleAddTag: PropTypes.func,
  handleRemoveTag: PropTypes.func,
  startChatting: PropTypes.func,
  tagsDisabled: PropTypes.bool,
};
export default HomeMobile;
