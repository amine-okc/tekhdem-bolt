// context/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { setConnectionStatus, forceLogout } from '../store/authSlice';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token && isAuthenticated && !socket) {
      const newSocket = io(process.env.REACT_APP_WEBSOCKET_URL, {
        auth: { token },
        transports: ['websocket']
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        dispatch(setConnectionStatus(true));
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        dispatch(setConnectionStatus(false));
      });

      newSocket.on('auth:logout', (data) => {
        dispatch(forceLogout({ reason: data.reason }));
        window.location.href = '/login';
      });

      setSocket(newSocket);
    }

    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [token, isAuthenticated]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};