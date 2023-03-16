import { useContext } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { Store } from "../store";

function ScrollableChat({ messages }) {
  const { state } = useContext(Store);
  const { user } = state;
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message, index) => {
          return (
            <div style={{ display: "flex" }} key={message._id}>
              <span
                style={{
                  backgroundColor: `${
                    user._id === message.sender._id ? "#BEE3F8" : "#B9F5D0"
                  }`,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  marginLeft: `${user._id === message.sender._id ? "auto" : 0}`,
                  marginTop: 3,
                }}
              >
                {message.content}
              </span>
            </div>
          );
        })}
    </ScrollableFeed>
  );
}

export default ScrollableChat;
