import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/homePage";
import ChatPage from "./pages/chatsPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
      <ToastContainer position="bottom-center" limit={1} />
    </div>
  );
}

export default App;
