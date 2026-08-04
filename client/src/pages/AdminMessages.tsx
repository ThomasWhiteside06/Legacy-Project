import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminMessages.css";

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
}

const AdminMessages = (): JSX.Element => {
  const [messages, setMessages] = useState<Message[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get<Message[]>(
          "http://localhost:3000/dashboard/messages",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [token]);

  return (
    <div className="admin-messages">
      <h3 className="title">Messages</h3>
      <ul className="messages-list">
        {messages.map((msg) => (
          <li key={msg._id} className="message-item">
            <p><strong>From:</strong> {msg.name}</p>
            <p><strong>Email:</strong> {msg.email}</p>
            <p>{msg.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminMessages;