import { createContext, useState, useEffect, useContext } from 'react';
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { getToken } from '../api/user';

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
}

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const userInfo = useSelector((state) => state.authSlice.userInfo);

  useEffect(() => {
    const fetchTokenAndConnect = async () => {
      if (!userInfo) {
        if (socket) {
          socket.close();
          setSocket(null);
        }
        return;
      }

      try {
        const response = await getToken();
        const token = response.data.data;

        const socketInstance = io("https://we-talks-frontend.vercel.app", {
          auth: {
            token: token
          }
        });

        socketInstance.on("connect", () => {
          console.log("Socket connected:", socketInstance.id);
        });
       

        socketInstance.on("getOnlineUsers", (users) => {
          console.log("Received online users:", users);
          setOnlineUsers(users);
        });

        setSocket(socketInstance);

        return () => {
          console.log("Socket disconnected:", socketInstance.id);
          socketInstance.close();
        };
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchTokenAndConnect();
  }, [userInfo]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
}
