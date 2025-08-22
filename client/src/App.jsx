// // cd "D:\Programming\Development\Dev Lecture Code\Personal Projects\Chat Bot\client"

import "./App.css";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

async function requestToSend(data) {
  try {
    const API_URL = import.meta.env.VITE_API_URL;
    const res = await fetch(`${API_URL}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Network response was not ok");

    const result = await res.json();
    return { success: true, answer: result.answer };
  } catch (error) {
    console.log("Error in requestToSend:", error);
    return { success: false, error };
  }
}

function App() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]); // chat messages
  const [question, setQuestion] = useState(""); // input text

  async function handleSubmit(e) {
    e.preventDefault();
    if (!question.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: question }]);
    setLoading(true);

    // Send request
    const data = { Question: question };
    const res = await requestToSend(data);

    if (res.success) {
      setMessages((prev) => [...prev, { sender: "bot", text: res.answer }]);
    } else {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Oops! Something went wrong." },
      ]);
    }

    setQuestion(""); // clear input
    setLoading(false);
  }

  return (
    <>
      <div className=" bg-white min-h-screen max-w-[1080px] flex flex-col lg:min-w-[1020px] md:min-w-[768px] sm:min-w-[640px]">
        {/* Title */}
        <div className="bg-gray-800 text-white p-2 text-center mb-[1rem] text-xl">
          <p>Chat Bot</p>
        </div>

        {/* main content */}
        <div className=" min-w-full bg-white my-1 p-2 flex-1">
          {/* chat window */}
          <div className=" flex-1 overflow-y-auto p-2 h-[450px] bg-white md: rounded-lg border ">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`my-2 p-2 rounded-lg w-fit max-w-[70%] ${
                  msg.sender === "user"
                    ? "ml-auto bg-blue-500 text-white"
                    : "mr-auto bg-gray-200 text-black"
                }`}
              >
                {msg.sender === "bot" ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            ))}

            {loading && (
              <div className="mr-auto bg-gray-300 text-black p-2 rounded-lg max-w-[75%]">
                Thinking...
              </div>
            )}
          </div>

          {/* input */}
          <form
            onSubmit={handleSubmit}
            className=" flex flex-row justify-center items-center gap-2 my-4 "
          >
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask something..."
              rows={3}
              disabled={loading}
              className=" border bg-white p-3 rounded-lg flex-1 text-sm text-center placeholder:text-center placeholder:text-gray-400 resize-none overflow-y-auto placeholder:p-2"
            ></textarea>

            <button type="submit" disabled={loading}>
              {/* Send */}
              {loading ? "Wait..." : "Send"}
            </button>
          </form>
        </div>

        {/* footer */}
        <footer className="bg-gray-800 text-white p-2 text-center mt-[1rem] text-xl">
          Made by Himanshu ❣
        </footer>
      </div>
    </>
  );
}

export default App;
