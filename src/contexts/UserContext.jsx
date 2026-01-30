import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8002';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [allClients, setAllClients] = useState([]);

  useEffect(() => {
    let mounted = true

    const init = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      // Fetch profile first so we know the role
      const profile = await fetchUserProfile()

      // Only fetch all clients if user is admin
      if (profile && profile.role === 'admin') {
        await fetchAllClients()
      } else if (profile && profile.role !== 'admin') {
        // Non-admin users should only see their own basic info
        // Ensure allClients contains at least the current user
        setAllClients([profile])
      }

      if (mounted) {
        setLoading(false)
      }
    }

    init()

    // Add a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (mounted) setLoading(false)
    }, 5000) // 5 seconds timeout

    return () => {
      mounted = false
      clearTimeout(timeout)
    }
  }, [token]);

  const fetchAllClients = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllClients(response.data.users || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      // Do not expose mock data when the API fails — keep clients empty
      setAllClients([]);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      return response.data
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // If we get a 401 error, clear the token and user
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
        console.log('Invalid token, cleared authentication')
        return null
      } else {
        // Don't clear token on other errors - user is still logged in
        // We'll use the basic user info we set during login
        console.log('Using basic user info from login')
        // Attempt to read basic user info from localStorage
        const stored = localStorage.getItem('user')
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            setUser(parsed)
            return parsed
          } catch (e) {
            console.error('Failed to parse stored user info', e)
          }
        }
        return null
      }
    }
  };

  const login = async (username, password) => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post(`${API_URL}/api/auth/login`, formData);
      
      const { access_token, user_id, role } = response.data;
      
      localStorage.setItem('token', access_token);
      setToken(access_token);
      
      // Set basic user info from login response
      // We'll fetch full profile later
      const basicUserInfo = {
        id: user_id,
        username: username,
        role: role,
        // We'll determine portfolio access based on username for now
        portfolio_access: getPortfolioAccessByUsername(username)
      };
      
      setUser(basicUserInfo);
      setLoading(false);
      
      // Store user info in localStorage for Login component access
      localStorage.setItem('user', JSON.stringify(basicUserInfo));
      
      return { success: true, role: role };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  // Helper function to determine portfolio access based on username
  const getPortfolioAccessByUsername = (username) => {
    switch (username) {
      case 'admin':
        // Admin has access to all portfolios
        return ['dube-trade-port', 'bertha-house'];
      case 'dube-user':
        return ['dube-trade-port'];
      case 'bertha-user':
        return ['bertha-house'];
      default:
        return [];
    }
  };

  // Helper function to get all available clients for admin
  const getAllClients = () => {
    if (user && user.role === 'admin') return allClients
    // For non-admins, return only their own client record if present
    if (user) {
      const own = allClients.find((c) => c.username === user.username)
      return own ? [own] : [user]
    }
    return []
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const signup = async (userData) => {
    try {
      // Add default role and portfolio access for new users
      const signupData = {
        ...userData,
        role: 'client', // Default role for new users
        portfolio_access: [] // Empty by default, admin will assign later
      };

      const response = await axios.post(`${API_URL}/api/auth/signup`, signupData);
      
      const { access_token, user_id, role, message } = response.data;
      
      localStorage.setItem('token', access_token);
      setToken(access_token);
      
      // Set basic user info from signup response
      const basicUserInfo = {
        id: user_id,
        username: userData.username,
        full_name: userData.full_name,
        role: role,
        portfolio_access: [] // New users start with no portfolio access
      };
      
      setUser(basicUserInfo);
      setLoading(false);
      
      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify(basicUserInfo));
      
      return { 
        success: true, 
        message: message || `Welcome ${userData.full_name}! Your account has been created. Please check your email for activation link.`
      };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Signup failed' 
      };
    }
  };

  const value = {
    user,
    loading,
    token,
    allClients,
    login,
    logout,
    signup,
    getAllClients,
    fetchAllClients,
    isAuthenticated: !!token,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
