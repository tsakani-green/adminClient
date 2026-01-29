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
    if (token) {
      fetchUserProfile();
      fetchAllClients();
    } else {
      setLoading(false);
    }

    // Add a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000); // 5 seconds timeout

    return () => clearTimeout(timeout);
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
      // Fallback to mock data if API fails
      setAllClients([
        {
          username: 'dube-user',
          full_name: 'Dube Trade Port Manager',
          email: 'dube@dubetradeport.com',
          role: 'client',
          portfolio_access: ['dube-trade-port', 'bertha-house'],
          status: 'active'
        },
        {
          username: 'bertha-user',
          full_name: 'Bertha House Manager',
          email: 'bertha@berthahouse.com',
          role: 'client',
          portfolio_access: ['bertha-house'],
          status: 'active'
        }
      ]);
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
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // If we get a 401 error, clear the token and user
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        console.log('Invalid token, cleared authentication');
      } else {
        // Don't clear token on other errors - user is still logged in
        // We'll use the basic user info we set during login
        console.log('Using basic user info from login');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);

      const response = await axios.post(`${API_URL}/api/auth/login`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
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
    return allClients;
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

  const value = React.useMemo(() => ({
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
  }), [user, loading, token, allClients]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
