import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
  user: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,

  chats: [],
  selectedChat: null,
  fetchChatAgain: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_CHATS":
      return { ...state, chats: action.payload };

    case "SET_USER":
      return { ...state, user: action.payload };

    case "LOGOUT":
      return { user: null, chats: [], selectedChat: null };

    case "SET_SELECTED_CHAT":
      return { ...state, selectedChat: action.payload };

    case "SET_FETCH_CHAT":
      return { ...state, fetchChatAgain: !state.fetchChatAgain };

    default:
      return state;
  }
};

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}