import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('tt_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('tt_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem('tt_user', JSON.stringify(res.data.user));
      })
      .catch(() => {
        localStorage.removeItem('tt_token');
        localStorage.removeItem('tt_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    localStorage.setItem('tt_token', res.data.token);
    localStorage.setItem('tt_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const signup = async (payload) => {
    const res = await api.post('/auth/signup', payload);
    localStorage.setItem('tt_token', res.data.token);
    localStorage.setItem('tt_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('tt_token');
    localStorage.removeItem('tt_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
