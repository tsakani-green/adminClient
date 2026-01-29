import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  Chip,
  Button,
  LinearProgress,
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Fab,
  alpha,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  Divider,
  Skeleton,
  Badge,
  Tooltip,
  Switch,
  FormControlLabel,
  CircularProgress,
  Backdrop,
  Stack,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  ListItemIcon,
  TextField,
  FormControl,
  Select,
} from '@mui/material'

// AI Components
import AIPredictionsPanel from '../components/dashboard/AIPredictionsPanel'
import AIRecommendationsPanel from '../components/dashboard/AIRecommendationsPanel'
import AIDocumentAnalyzer from '../components/dashboard/AIDocumentAnalyzer'
import AIReportGenerator from '../components/dashboard/AIReportGenerator'

import {
  Assessment as AssessmentIcon,
  Storage as StorageIcon,
  People as PeopleIcon,
  Business,
  Download,
  Visibility,
  Edit,
  Refresh,
  Notifications,
  Security,
  Timeline,
  ArrowUpward,
  ArrowDownward,
  OpenInNew,
  Settings,
  Group,
  AccessTime,
  CloudUpload,
  LockOpen,
  Lock,
  VerifiedUser,
  Block,
  Delete,
  Save,
  History,
  Person,
  AdminPanelSettings,
  ManageAccounts,
  Favorite as MonitorHeart,
  EnergySavingsLeaf,
  Logout,
  Close,
  HealthAndSafety,
  Dashboard,
  BugReport,
  SystemUpdate,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import logo from '../assets/AfricaESG.AI.png'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8002'

const AdminDashboard = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { user, getAllClients, logout } = useUser()

  // Get real client data
  const allClients = getAllClients()
  
  // State for real portfolio data from database
  const [dbPortfolios, setDbPortfolios] = useState([])
  const [loadingPortfolios, setLoadingPortfolios] = useState(true)
  const [lastPortfolioRefresh, setLastPortfolioRefresh] = useState(null)
  const [autoRefreshing, setAutoRefreshing] = useState(false)
  
  // State for current section within AdminDashboard
  const [currentSection, setCurrentSection] = useState('overview') // overview, reports, files, security, settings
  
  // Fetch real portfolio data from database
  const fetchPortfoliosFromDB = useCallback(async (isAutoRefresh = false) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.log('No token found, skipping portfolio fetch')
        return
      }
      
      if (isAutoRefresh) {
        setAutoRefreshing(true)
      } else {
        setLoadingPortfolios(true)
      }
      
      const response = await axios.get(`${API_URL}/api/admin/clients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000, // Add timeout to prevent hanging
      })
      
      // Extract portfolios from all clients
      const portfolios = []
      response.data.clients.forEach(client => {
        if (client.portfolios && Array.isArray(client.portfolios)) {
          client.portfolios.forEach(portfolio => {
            portfolios.push({
              ...portfolio,
              clientName: client.full_name || client.username,
              clientId: client.username,
              clientEmail: client.email,
              clientStatus: client.status
            })
          })
        }
      })
      
      setDbPortfolios(portfolios)
      setLastPortfolioRefresh(new Date())
      console.log('Loaded portfolios from database:', portfolios.length)
    } catch (error) {
      console.error('Error fetching portfolios from database:', error)
      if (error.response?.status === 401) {
        console.log('Authentication error, user may need to re-login')
        logout()
        navigate('/login')
      } else if (error.response?.status === 500) {
        console.log('Server error, using fallback data')
      } else if (error.code === 'ECONNABORTED') {
        console.log('Request timeout, using fallback data')
      }
      // Fallback to empty array
      setDbPortfolios([])
    } finally {
      setLoadingPortfolios(false)
      setAutoRefreshing(false)
    }
  }, [logout, navigate])
  
  // Fetch portfolios when component mounts or user changes
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchPortfoliosFromDB()
    }
  }, [user, fetchPortfoliosFromDB])
  
  // Auto-refresh portfolios every 30 seconds
  useEffect(() => {
    if (user && user.role === 'admin') {
      const interval = setInterval(() => {
        fetchPortfoliosFromDB(true) // Pass true for auto-refresh
      }, 30000) // Refresh every 30 seconds
      
      return () => clearInterval(interval) // Cleanup on unmount
    }
  }, [user, fetchPortfoliosFromDB])
  
  // Use real portfolio data from database, fallback to hardcoded data for demo
  const allPortfolios = dbPortfolios.length > 0 ? dbPortfolios : [
    {
      id: 'dube-trade-port',
      name: 'Dube Trade Port',
      type: 'Portfolio',
      assets: [
        {
          id: '29-degrees-south',
          name: '29 Degrees South',
          type: 'Asset',
          epcGrade: 'G',
          hasSolar: false,
          emissions_tco2e: 2254.67,
          energyPerformance_kwh_m2a: 453.54,
          annualEnergy: { total_kwh: 2277442.8 },
          energyTypes: ['Electricity (Grid)']
        },
        {
          id: 'dube-cargo-terminal',
          name: 'Dube Cargo Terminal',
          type: 'Asset',
          epcGrade: 'G',
          hasSolar: false,
          emissions_tco2e: 2269.75,
          energyPerformance_kwh_m2a: 635.58,
          annualEnergy: { total_kwh: 2292672.6 },
          energyTypes: ['Electricity (Grid)']
        },
        {
          id: 'tradehouse',
          name: 'Tradehouse',
          type: 'Asset',
          epcGrade: 'C',
          hasSolar: true,
          emissions_tco2e: 518.95,
          energyPerformance_kwh_m2a: 78.3,
          annualEnergy: { total_kwh: 524189.4 },
          energyTypes: ['Electricity (Grid)']
        },
        {
          id: 'gift-of-the-givers',
          name: 'Gift of the Givers',
          type: 'Asset',
          epcGrade: 'A',
          hasSolar: false,
          emissions_tco2e: 1.91,
          energyPerformance_kwh_m2a: 1.09,
          annualEnergy: { total_kwh: 1927 },
          energyTypes: ['Electricity (Grid)']
        },
        {
          id: 'sky-aviation',
          name: 'Sky Aviation',
          type: 'Asset',
          epcGrade: 'B',
          hasSolar: false,
          emissions_tco2e: 78.1,
          energyPerformance_kwh_m2a: 60.3,
          annualEnergy: { total_kwh: 78890 },
          energyTypes: ['Electricity (Grid)']
        },
        {
          id: 'airchefs',
          name: 'AirChefs',
          type: 'Asset',
          epcGrade: 'G',
          hasSolar: false,
          emissions_tco2e: 41.74,
          energyPerformance_kwh_m2a: 1181.2,
          annualEnergy: { total_kwh: 42164.3 },
          energyTypes: ['Electricity (Grid)']
        },
        {
          id: 'block-d-greenhouse-packhouse',
          name: 'Block D- Greenhouse and Packhouse',
          type: 'Asset',
          epcGrade: 'B',
          hasSolar: true,
          emissions_tco2e: 121.1,
          energyPerformance_kwh_m2a: 79.77,
          annualEnergy: { total_kwh: 157362.1 },
          energyTypes: ['Electricity (Grid)', 'Electricity (Solar)']
        },
        {
          id: 'greenhouse-a',
          name: 'GreenHouse A',
          type: 'Asset',
          epcGrade: 'F',
          hasSolar: true,
          emissions_tco2e: 196.65,
          energyPerformance_kwh_m2a: 224.36,
          annualEnergy: { total_kwh: 339112.24 },
          energyTypes: ['Electricity (Grid)', 'Electricity (Solar)']
        },
        {
          id: 'greenhouse-packhouse-c',
          name: 'Greenhouse and Pack House C',
          type: 'Asset',
          epcGrade: 'D',
          hasSolar: false,
          emissions_tco2e: 139.07,
          energyPerformance_kwh_m2a: 135.59,
          annualEnergy: { total_kwh: 565002 },
          energyTypes: ['Electricity (Grid)']
        },
        {
          id: 'farmwise',
          name: 'Farmwise',
          type: 'Asset',
          epcGrade: 'F',
          hasSolar: false,
          emissions_tco2e: 1118.91,
          energyPerformance_kwh_m2a: 212.01,
          annualEnergy: { total_kwh: 1130208.2 },
          energyTypes: ['Electricity (Grid)']
        }
      ]
    },
    {
      id: 'bertha-house',
      name: 'Bertha House',
      type: 'Portfolio',
      meterName: 'Local Mains',
      vendor: 'eGauge',
      hasMeterData: true,
    }
  ]

  // State Management
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [clientsWithPortfolios, setClientsWithPortfolios] = useState([])
  const [portfoliosLoading, setPortfoliosLoading] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFiles: 0,
    totalReports: 0,
    activeUsers: 0,
    monthlyGrowth: 0,
    systemHealth: 0,
    serverUptime: 0,
    responseTime: 0,
    storageUsed: 0,
    apiCalls: 0,
    securityAlerts: 0,
    complianceScore: 0,
    dataProcessed: 0,
    totalEmissions: 0,
  })
  const [animatedUsers, setAnimatedUsers] = useState(0)
  const [selectedClient, setSelectedClient] = useState(null)
  const [clientDetailsOpen, setClientDetailsOpen] = useState(false)
  const [detailsTab, setDetailsTab] = useState(0)
  const [isEditingClient, setIsEditingClient] = useState(false)
  const [newClientOpen, setNewClientOpen] = useState(false)
  const [newClientData, setNewClientData] = useState({
    full_name: '',
    username: '',
    email: '',
    status: 'active',
    portfolio_access: []
  })
  const [refreshing, setRefreshing] = useState(false)
  const [realTimeMode, setRealTimeMode] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h')
  const [systemAlerts, setSystemAlerts] = useState([])
  const [performanceMetrics, setPerformanceMetrics] = useState([])

  const [userProfileOpen, setUserProfileOpen] = useState(false)
  const [selectedUserForProfile, setSelectedUserForProfile] = useState(null)
  const [profileTab, setProfileTab] = useState(0)
  const [newPortfolioOpen, setNewPortfolioOpen] = useState(false)
  const [newPortfolioData, setNewPortfolioData] = useState({
    name: '',
    clientId: '',
    description: '',
    status: 'active'
  })
  const [portfolioDetailsOpen, setPortfolioDetailsOpen] = useState(false)
  const [selectedPortfolio, setSelectedPortfolio] = useState(null)
  const [isEditingPortfolio, setIsEditingPortfolio] = useState(false)
  
  const [userProfileData, setUserProfileData] = useState({
    personal: {},
    professional: {},
    security: {},
    activity: [],
    permissions: {},
    notifications: {},
  })
  const [anchorEl, setAnchorEl] = useState(null)

  // User menu handlers
  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleUserMenuClose()
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  // Debug logging
  console.log('AdminDashboard - User:', user)
  console.log('AdminDashboard - Loading:', loading)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 5000)
    return () => clearTimeout(t)
  }, [])

  // Define fetchAdminData before useEffect
  const fetchAdminData = useCallback(async () => {
    try {
      setRefreshing(true)
      await new Promise((resolve) => setTimeout(resolve, 900))

      // Calculate real stats from actual data
      const totalClients = allClients.length
      const activeClientsCount = allClients.filter(c => c.status === 'active').length
      
      // Calculate active users in last 24 hours (more accurate for dashboard)
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      const activeUsersLast24h = allClients.filter(client => {
        // Check if client has recent activity
        const lastLogin = client.last_login ? new Date(client.last_login) : null
        const createdAt = client.created_at ? new Date(client.created_at) : null
        
        // Consider user active if logged in within 24h or created within 24h
        return (lastLogin && lastLogin > twentyFourHoursAgo) || 
               (createdAt && createdAt > twentyFourHoursAgo) ||
               client.status === 'active' // Fallback to status for demo
      }).length
      
      const totalAssets = allPortfolios.reduce((sum, p) => sum + (p.assets?.length || 0), 0)
      const solarAssets = allPortfolios.reduce((sum, p) => sum + (p.assets?.filter(a => a.hasSolar).length || 0), 0)
      const totalEmissionsTco2e = allPortfolios.reduce((sum, p) => 
        sum + (p.assets?.reduce((asum, a) => asum + (a.emissions_tco2e || 0), 0) || 0), 0
      )
      
      // Calculate total files and reports from client data
      const totalFilesCount = allClients.reduce((sum, client) => {
        const clientPortfolios = allPortfolios.filter(p => (client.portfolio_access || []).includes(p.id))
        const clientAssets = clientPortfolios.flatMap(p => p.assets || [])
        return sum + (clientAssets.length * 5)
      }, 0)
      
      const totalReportsCount = allClients.reduce((sum, client) => {
        const clientPortfolios = allPortfolios.filter(p => (client.portfolio_access || []).includes(p.id))
        const clientAssets = clientPortfolios.flatMap(p => p.assets || [])
        return sum + Math.floor(clientAssets.length * 0.6)
      }, 0)

      setStats({
        totalUsers: totalClients,
        totalFiles: totalFilesCount,
        totalReports: totalReportsCount,
        activeUsers: activeUsersLast24h,
        monthlyGrowth: 12,
        systemHealth: 96,
        serverUptime: 99.9,
        responseTime: 145,
        storageUsed: 58,
        apiCalls: 8420,
        securityAlerts: 1,
        complianceScore: 95,
        dataProcessed: totalAssets,
        totalEmissions: totalEmissionsTco2e,
        totalAssets: totalAssets,
        solarAssets: solarAssets,
      })

      setSystemAlerts([
        { id: 1, type: 'info', message: 'All systems operational', timestamp: 'now', severity: 'low' },
        { id: 2, type: 'info', message: `${activeUsersLast24h} active users in last 24 hours`, timestamp: '5 minutes ago', severity: 'low' },
        { id: 3, type: 'info', message: `${totalAssets} assets under monitoring`, timestamp: '10 minutes ago', severity: 'low' },
      ])

      setPerformanceMetrics([
        { time: '00:00', cpu: 35, memory: 48, network: 18, disk: 62 },
        { time: '04:00', cpu: 28, memory: 42, network: 14, disk: 58 },
        { time: '08:00', cpu: 52, memory: 61, network: 35, disk: 72 },
        { time: '12:00', cpu: 68, memory: 72, network: 55, disk: 81 },
        { time: '16:00', cpu: 54, memory: 58, network: 42, disk: 75 },
        { time: '20:00', cpu: 42, memory: 51, network: 28, disk: 68 },
        { time: '23:59', cpu: 31, memory: 45, network: 22, disk: 61 },
      ])
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
      setStats({
        totalUsers: 0,
        totalFiles: 0,
        totalReports: 0,
        activeUsers: 0,
        monthlyGrowth: 0,
        systemHealth: 0,
        serverUptime: 0,
        responseTime: 0,
        storageUsed: 0,
        apiCalls: 0,
        securityAlerts: 0,
        complianceScore: 0,
        dataProcessed: 0,
        totalEmissions: 0,
        totalAssets: 0,
        solarAssets: 0,
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [allClients, allPortfolios])

  useEffect(() => {
    fetchAdminData()
    if (realTimeMode) {
      const interval = setInterval(fetchAdminData, 30000)
      return () => clearInterval(interval)
    }
  }, [realTimeMode, fetchAdminData])

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedUsers(stats.totalUsers), 350)
    return () => clearTimeout(timer)
  }, [stats.totalUsers])

  const ModernStatCard = ({ title, value, icon, color, subtitle, trend, unit, onClick, isLoading = false }) => {
    const palette = theme.palette[color] || theme.palette.primary

    return (
      <Card
        sx={{
          height: '100%',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.25s ease',
          background: `linear-gradient(135deg, ${alpha(palette.main, 0.08)} 0%, ${alpha(palette.light, 0.02)} 100%)`,
          border: `1px solid ${alpha(palette.main, 0.12)}`,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 12px 24px ${alpha(palette.main, 0.15)}`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${palette.main} 0%, ${palette.light} 100%)`,
          },
        }}
        onClick={onClick}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: alpha(palette.main, 0.15),
                color: palette.main,
                width: 40,
                height: 40,
                borderRadius: 2,
              }}
            >
              {icon}
            </Avatar>

            {typeof trend === 'number' ? (
              <Chip
                icon={trend >= 0 ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
                label={`${Math.abs(trend)}%`}
                color={trend >= 0 ? 'success' : 'error'}
                size="small"
                sx={{ 
                  fontWeight: 700, 
                  height: 22,
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: '0.7rem',
                  letterSpacing: '0.025em'
                }}
              />
            ) : null}
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ 
              mb: 0.5, 
              fontWeight: 600, 
              textTransform: 'uppercase', 
              letterSpacing: '0.4px',
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontSize: '0.75rem',
              lineHeight: 1.2
            }}
          >
            {title}
          </Typography>

          {isLoading ? (
            <Skeleton variant="text" width={100} height={32} />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
              <Typography 
                variant="h4" 
                fontWeight={700} 
                sx={{ 
                  letterSpacing: '-0.3px',
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  lineHeight: 1.1,
                  fontSize: '1.75rem'
                }}
              >
                {title === 'Total Users' ? animatedUsers : value}
              </Typography>
              {unit ? (
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ 
                    fontWeight: 500,
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    fontSize: '0.75rem'
                  }}
                >
                  {unit}
                </Typography>
              ) : null}
            </Box>
          )}

          {subtitle ? (
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                mt: 0.5, 
                display: 'block', 
                fontWeight: 400,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '0.7rem',
                lineHeight: 1.3,
                letterSpacing: '0.025em'
              }}
            >
              {subtitle}
            </Typography>
          ) : null}
        </CardContent>
      </Card>
    )
  }

  // Charts / Data
  // Generate user growth data based on real clients - simulating 6 months of growth
  const userGrowthData = (() => {
    const clientCount = allClients.length
    const activeCount = allClients.filter(c => c.status === 'active').length
    // Simulate historical growth with current data at the end
    const baseUsers = Math.max(2, clientCount - 2)
    const baseActive = Math.max(1, activeCount - 1)
    return [
      { month: 'Jan', users: Math.max(1, baseUsers - 4), activeUsers: Math.max(1, baseActive - 3) },
      { month: 'Feb', users: Math.max(1, baseUsers - 3), activeUsers: Math.max(1, baseActive - 2) },
      { month: 'Mar', users: Math.max(1, baseUsers - 2), activeUsers: Math.max(1, baseActive - 1) },
      { month: 'Apr', users: Math.max(1, baseUsers - 1), activeUsers: baseActive },
      { month: 'May', users: baseUsers, activeUsers: activeCount },
      { month: 'Jun', users: clientCount, activeUsers: activeCount },
    ]
  })()

  // Enhanced client data with real portfolio information
  const topClients = allClients.map((client, index) => {
    const clientPortfolios = allPortfolios.filter(p => (client.portfolio_access || []).includes(p.id))
    const clientAssets = clientPortfolios.flatMap(p => p.assets || [])
    const totalEmissions = clientAssets.reduce((sum, asset) => sum + (asset.emissions_tco2e || 0), 0)
    const avgEsgScore = clientAssets.length > 0 
      ? clientAssets.reduce((sum, asset) => {
          const scoreMap = { 'A': 95, 'B': 85, 'C': 75, 'D': 65, 'E': 55, 'F': 45, 'G': 35 }
          return sum + (scoreMap[asset.epcGrade] || 50)
        }, 0) / clientAssets.length
      : 50

    return {
      id: index + 1,
      name: client.full_name,
      username: client.username,
      email: client.email,
      phone: client.phone || '+27 (11) 123-4567',
      address: client.address || 'Johannesburg, South Africa',
      industry: client.industry || (client.username.includes('dube') ? 'Trade & Logistics' : 'Real Estate'),
      founded: client.founded || '2020',
      employees: client.employees || (client.username.includes('dube') ? '50-100' : '10-50'),
      revenue: client.revenue || (client.username.includes('dube') ? '$10M-50M' : '$1M-10M'),
      website: client.website || `www.${client.username.replace('-', '')}.com`,
      files: clientAssets.length * 5,
      reports: Math.floor(clientAssets.length * 0.6),
      esgScore: Math.round(avgEsgScore),
      status: client.status || 'active',
      lastActive: client.last_login ? new Date(client.last_login).toLocaleString() : 'Online now',
      growth: client.growth || (client.username.includes('admin') ? 25 : client.username.includes('dube') ? 15 : 8),
      contactPerson: client.full_name,
      subscription: client.subscription || 'Professional',
      joinDate: client.created_at ? new Date(client.created_at).toISOString().split('T')[0] : '2024-01-15',
      portfolio_access: client.portfolio_access || [],
      assets_count: clientAssets.length,
      emissions_tco2e: totalEmissions,
    }
  })

  // Generate recent activity from real client data
  const recentActivity = (() => {
    const activities = []
    const timeAgo = ['2 minutes ago', '15 minutes ago', '1 hour ago', '2 hours ago', '3 hours ago']
    const actionTypes = [
      'Generated quarterly ESG report',
      'Updated energy consumption data',
      'Updated client portfolio access',
      'Viewed asset performance metrics',
      'Downloaded monthly report'
    ]
    const typeMap = ['report', 'upload', 'update', 'user', 'download']
    
    allClients.slice(0, 5).forEach((client, index) => {
      activities.push({
        id: index + 1,
        user: client.full_name || client.username,
        action: actionTypes[index % actionTypes.length],
        time: timeAgo[index % timeAgo.length],
        type: typeMap[index % typeMap.length]
      })
    })
    
    return activities.length > 0 ? activities : [
      { id: 1, user: 'System', action: 'Dashboard initialized', time: 'now', type: 'info' },
      { id: 2, user: 'System', action: 'Monitoring active', time: '5 minutes ago', type: 'info' }
    ]
  })()

  const allClientReports = [
    {
      id: 1,
      clientName: 'Dube Trade Port Manager',
      reportType: 'Comprehensive ESG Report',
      generatedDate: '2024-01-15',
      status: 'completed',
      esgScore: 72,
      period: 'Q4 2023',
      fileSize: '2.4 MB',
      downloadUrl: '#',
    },
    {
      id: 2,
      clientName: 'Bertha House Manager',
      reportType: 'Energy Performance Report',
      generatedDate: '2024-01-12',
      status: 'completed',
      esgScore: 68,
      period: 'Q4 2023',
      fileSize: '1.8 MB',
      downloadUrl: '#',
    },
    {
      id: 3,
      clientName: 'Dube Trade Port Manager',
      reportType: 'Carbon Emissions Analysis',
      generatedDate: '2024-01-10',
      status: 'completed',
      esgScore: 72,
      period: 'Q4 2023',
      fileSize: '1.2 MB',
      downloadUrl: '#',
    },
  ]

  const getClientDetails = (clientId) => {
    const client = topClients.find((c) => c.id === clientId)
    if (!client) return null

    // Get detailed portfolio and asset information
    const clientPortfolios = allPortfolios.filter(p => (client.portfolio_access || []).includes(p.id))
    const clientAssets = clientPortfolios.flatMap(p => p.assets || [])

    return {
      ...client,
      portfolios: clientPortfolios.map(portfolio => ({
        ...portfolio,
        assets: portfolio.assets || [],
        assetCount: (portfolio.assets || []).length,
        totalEmissions: (portfolio.assets || []).reduce((sum, asset) => sum + (asset.emissions_tco2e || 0), 0),
        avgEpcGrade: (portfolio.assets || []).length > 0 
          ? (portfolio.assets || []).reduce((sum, asset) => {
              const scoreMap = { 'A': 95, 'B': 85, 'C': 75, 'D': 65, 'E': 55, 'F': 45, 'G': 35 }
              return sum + (scoreMap[asset.epcGrade] || 50)
            }, 0) / (portfolio.assets || []).length
          : 50,
      })),
      assets: clientAssets,
      esgHistory: [
        { period: 'Q4 2023', score: 85, change: '+3' },
        { period: 'Q3 2023', score: 82, change: '+1' },
        { period: 'Q2 2023', score: 81, change: '-2' },
        { period: 'Q1 2023', score: 83, change: '+5' },
      ],
      recentReports: allClientReports.filter((r) => r.clientName === client.name),
      activity: [
        { date: '2024-01-15', action: 'Generated Comprehensive ESG Report', type: 'report' },
        { date: '2024-01-12', action: 'Updated company information', type: 'update' },
        { date: '2024-01-10', action: 'Uploaded 23 new documents', type: 'upload' },
        { date: '2024-01-08', action: 'Downloaded quarterly report', type: 'download' },
        { date: '2024-01-05', action: 'Changed subscription plan', type: 'admin' },
      ],
      metrics: {
        environmental: { score: 88, trend: '+5', status: 'excellent' },
        social: { score: 82, trend: '+2', status: 'good' },
        governance: { score: 85, trend: '+1', status: 'good' },
      },
      documents: {
        total: client.files,
        categories: {
          'Environmental Reports': 45,
          'Social Impact': 38,
          'Governance Docs': 52,
          'Financial Data': 67,
          Other: 32,
        },
      },
    }
  }

  const handleClientClick = (clientId) => {
    const details = getClientDetails(clientId)
    setSelectedClient(details)
    setClientDetailsOpen(true)
    setDetailsTab(0)
  }

  const handleCloseClientDetails = () => {
    setClientDetailsOpen(false)
    setSelectedClient(null)
    setDetailsTab(0)
  }

  const handleOpenUserProfile = (user) => {
    setSelectedUserForProfile(user)

    setUserProfileData({
      personal: {
        fullName: user.name,
        email: user.email,
        phone: user.phone || '+1 (555) 123-4567',
        location: user.location || 'New York, USA',
        bio: user.bio || 'ESG professional focused on sustainability and environmental impact.',
      },
      professional: {
        company: user.name,
        jobTitle: user.jobTitle || 'Sustainability Manager',
        department: user.department || 'ESG & Compliance',
        role: user.role || 'user',
        status: user.status || 'active',
        subscription: user.subscription || 'premium',
      },
      security: {
        lastLogin: new Date().toISOString(),
        loginCount: 156,
        failedAttempts: 2,
        twoFactorEnabled: true,
        securityScore: 85,
        passwordStrength: 'strong',
        lastPasswordChange: '2024-01-15',
        activeSessions: 3,
      },
      activity: [
        {
          id: 1,
          type: 'login',
          action: 'User logged in',
          details: 'Successful login from Chrome on Windows',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'success',
          ipAddress: '192.168.1.100',
        },
        {
          id: 2,
          type: 'upload',
          action: 'Uploaded ESG report',
          details: 'Q1 2024 Sustainability Report uploaded',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          status: 'success',
          ipAddress: '192.168.1.100',
        },
        {
          id: 3,
          type: 'failed_login',
          action: 'Failed login attempt',
          details: 'Incorrect password entered',
          timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'error',
          ipAddress: '89.216.34.78',
        },
      ],
      permissions: {
        dashboard: { view: true, edit: false, delete: false },
        reports: { view: true, edit: true, delete: false },
        users: { view: false, edit: false, delete: false },
        settings: { view: false, edit: false, delete: false },
        files: { view: true, edit: true, delete: true },
      },
      notifications: {
        email: true,
        push: true,
        sms: false,
        reports: true,
        security: true,
        updates: false,
        digest: 'weekly',
      },
    })

    setProfileTab(0)
    setUserProfileOpen(true)
  }

  const handleCloseUserProfile = () => {
    setUserProfileOpen(false)
    setSelectedUserForProfile(null)
    setProfileTab(0)
  } // Fixed: Added missing closing brace

  const handleTabChange = (event, newValue) => setDetailsTab(newValue)

  // Client Management Handlers
  const handleDeleteClient = async (clientUsername) => {
    console.log('Delete client called with username:', clientUsername)
    console.log('API URL:', API_URL)
    
    if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          alert('Authentication required')
          return
        }

        console.log('Deleting client with username:', clientUsername)
        console.log('Full URL:', `${API_URL}/api/admin/clients/${clientUsername}`)

        const response = await axios.delete(`${API_URL}/api/admin/clients/${clientUsername}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log('Delete response:', response)

        if (response.data.success) {
          alert('Client deleted successfully')
          
          // Show refreshing state
          setRefreshing(true)
          
          // Refresh all data
          await fetchAdminData()
          
          // Hide refreshing state after a short delay
          setTimeout(() => {
            setRefreshing(false)
          }, 1000)
          
          // Close any open client details dialog if the deleted client was selected
          if (selectedClient && selectedClient.username === clientUsername) {
            setClientDetailsOpen(false)
            setSelectedClient(null)
            setDetailsTab(0)
          }
        } else {
          alert('Failed to delete client')
        }
      } catch (error) {
        console.error('Error deleting client:', error)
        console.error('Error response:', error.response)
        console.error('Error status:', error.response?.status)
        console.error('Error data:', error.response?.data)
        
        if (error.response?.status === 404) {
          alert('Client not found. The client may have already been deleted.')
        } else if (error.response?.status === 401) {
          alert('Authentication failed. Please log in again.')
        } else if (error.response?.status === 403) {
          alert('Access denied. Admin access required.')
        } else if (error.response?.status === 500) {
          alert('Server error. Please try again later.')
        } else {
          alert('Error deleting client: ' + (error.response?.data?.detail || error.message))
        }
      }
    }
  }
  const handleEditClient = (client) => {
    setSelectedClient(client)
    setIsEditingClient(true)
    setClientDetailsOpen(true)
    setDetailsTab(0) // Switch to personal info tab
  }

  const handleSaveClient = async () => {
    if (!selectedClient) return
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Authentication required')
        return
      }

      const response = await axios.put(`${API_URL}/api/admin/clients/${selectedClient.username}`, {
        full_name: selectedClient.full_name,
        email: selectedClient.email,
        username: selectedClient.username,
        status: selectedClient.status,
        portfolio_access: selectedClient.portfolio_access,
        company: selectedClient.company,
        phone: selectedClient.phone,
        location: selectedClient.location,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.success) {
        alert('Client updated successfully')
        setIsEditingClient(false)
        setClientDetailsOpen(false)
        
        // Show refreshing state
        setRefreshing(true)
        
        // Refresh all data
        await fetchAdminData()
        
        // Hide refreshing state after a short delay
        setTimeout(() => {
          setRefreshing(false)
        }, 1000)
      } else {
        alert('Failed to update client')
      }
    } catch (error) {
      console.error('Error updating client:', error)
      const errorMessage = error.response?.data?.detail || 'Failed to update client'
      alert(`Error: ${errorMessage}`)
    }
  }

  const handleCreateNewClient = () => {
    if (newClientData.full_name && newClientData.email) {
      console.log('Creating new client:', newClientData)
      // Reset form
      setNewClientData({
        full_name: '',
        username: '',
        email: '',
        status: 'active',
        portfolio_access: []
      })
      setNewClientOpen(false)
    }
  }

  const handleUpdateNewClientField = (field, value) => {
    setNewClientData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCreateNewPortfolio = async () => {
    if (newPortfolioData.name && newPortfolioData.clientId) {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          alert('Authentication required')
          return
        }

        console.log('Creating portfolio with data:', newPortfolioData)

        const response = await axios.post(`${API_URL}/api/admin/portfolios`, {
          name: newPortfolioData.name,
          client_id: newPortfolioData.clientId,
          description: newPortfolioData.description,
          status: newPortfolioData.status
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log('Portfolio creation response:', response.data)

        if (response.data.success) {
          // Reset form
          setNewPortfolioData({
            name: '',
            clientId: '',
            description: '',
            status: 'active'
          })
          setNewPortfolioOpen(false)
          
          // Refresh portfolios from database
          fetchPortfoliosFromDB()
          
          // Show success message
          alert(response.data.message)
        } else {
          alert('Failed to create portfolio: ' + (response.data.message || 'Unknown error'))
        }
      } catch (error) {
        console.error('Error creating portfolio:', error)
        const errorMessage = error.response?.data?.detail || error.message || 'Failed to create portfolio'
        console.error('Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        })
        alert(`Error: ${errorMessage}`)
      }
    } else {
      alert('Please fill in all required fields')
    }
  }

  const handleUpdateNewPortfolioField = (field, value) => {
    setNewPortfolioData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleViewPortfolio = (portfolio) => {
    setSelectedPortfolio(portfolio)
    setPortfolioDetailsOpen(true)
    setIsEditingPortfolio(false)
  }

  const handleEditPortfolio = () => {
    setIsEditingPortfolio(true)
  }

  const handleSavePortfolio = () => {
    if (selectedPortfolio) {
      console.log('Saving portfolio:', selectedPortfolio)
      setIsEditingPortfolio(false)
      setPortfolioDetailsOpen(false)
      alert(`Portfolio "${selectedPortfolio.name}" updated successfully!`)
    }
  }

  const handleDeletePortfolio = (portfolio) => {
    if (window.confirm(`Are you sure you want to delete portfolio "${portfolio.name}"? This action cannot be undone.`)) {
      console.log('Deleting portfolio:', portfolio.id)
      
      // Show refreshing state
      setRefreshing(true)
      
      setPortfolioDetailsOpen(false)
      alert(`Portfolio "${portfolio.name}" deleted successfully!`)
      
      // Refresh data after deletion
      fetchAdminData().then(() => {
        // Hide refreshing state after a short delay
        setTimeout(() => {
          setRefreshing(false)
        }, 1000)
      })
    }
  }

  const handleUpdatePortfolioField = (field, value) => {
    setSelectedPortfolio(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // UI Helpers
  const surfaceCard = {
    borderRadius: 3,
    border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    transition: 'all 0.2s ease',
    overflow: 'hidden',
    '&:hover': {
      boxShadow: theme.shadows[4],
      transform: 'translateY(-1px)',
    },
  }

  if (loading) {
    console.log('AdminDashboard still loading...')
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
            Loading Admin Dashboard...
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            User: {user?.username || 'Not loaded'}
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: (t) => t.zIndex.drawer + 1 }} open={refreshing}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Refreshing data...
          </Typography>
        </Box>
      </Backdrop>

      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar */}
        <Paper
          sx={{
            width: 280,
            borderRadius: 0,
            borderRight: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
            background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${theme.palette.background.paper} 100%)`,
          }}
        >
          <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Box
                component="img"
                src={logo}
                alt="AfricaESG.AI"
                sx={{
                  width: 48,
                  height: 48,
                  objectFit: 'contain',
                  borderRadius: 1,
                  mr: 2,
                }}
              />
              <Box>
                <Typography variant="h6" fontWeight={900}>
                  AfricaESG.AI
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Admin Panel
                </Typography>
              </Box>
            </Box>

            <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 2, color: 'text.secondary' }}>
              USER MANAGEMENT
            </Typography>

            <Stack spacing={1} sx={{ mb: 4 }}>
              <Button
                fullWidth
                variant={activeSection === 'clients' ? 'contained' : 'outlined'}
                startIcon={<ManageAccounts />}
                onClick={() => {
                  setActiveSection('clients')
                  setCurrentSection('overview')
                }}
                sx={{
                  py: 1.4,
                  borderRadius: 2,
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  fontWeight: 700,
                  backgroundColor: activeSection === 'clients' ? 'primary.main' : 'transparent',
                  color: activeSection === 'clients' ? 'white' : 'primary.main',
                  borderColor: activeSection === 'clients' ? 'transparent' : alpha(theme.palette.primary.main, 0.3),
                  '&:hover': {
                    backgroundColor: activeSection === 'clients' ? 'primary.dark' : alpha(theme.palette.primary.main, 0.08),
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                  },
                }}
              >
                Manage Clients
              </Button>

              <Button
                fullWidth
                variant={activeSection === 'portfolios' ? 'contained' : 'outlined'}
                startIcon={<Business />}
                onClick={() => {
                  setActiveSection('portfolios')
                  setCurrentSection('overview')
                }}
                sx={{
                  py: 1.4,
                  borderRadius: 2,
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  fontWeight: 700,
                  backgroundColor: activeSection === 'portfolios' ? 'primary.main' : 'transparent',
                  color: activeSection === 'portfolios' ? 'white' : 'primary.main',
                  borderColor: activeSection === 'portfolios' ? 'transparent' : alpha(theme.palette.primary.main, 0.3),
                  '&:hover': {
                    backgroundColor: activeSection === 'portfolios' ? 'primary.dark' : alpha(theme.palette.primary.main, 0.08),
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                  },
                }}
              >
                Client Portfolios
              </Button>
            </Stack>

            <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 2, color: 'text.secondary' }}>
              SYSTEM MANAGEMENT
            </Typography>

            <Stack spacing={1} sx={{ mb: 4 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AssessmentIcon />}
                onClick={() => setCurrentSection('reports')}
                sx={{ 
                  py: 1.2, 
                  borderRadius: 2, 
                  justifyContent: 'flex-start', 
                  textTransform: 'none', 
                  color: currentSection === 'reports' ? 'white' : 'primary.main', 
                  fontWeight: 700, 
                  borderColor: currentSection === 'reports' ? 'primary.main' : alpha(theme.palette.divider, 0.3),
                  bgcolor: currentSection === 'reports' ? 'primary.main' : 'transparent'
                }}
              >
                System Reports
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<StorageIcon />}
                onClick={() => setCurrentSection('files')}
                sx={{ 
                  py: 1.2, 
                  borderRadius: 2, 
                  justifyContent: 'flex-start', 
                  textTransform: 'none', 
                  color: currentSection === 'files' ? 'white' : 'primary.main', 
                  fontWeight: 700, 
                  borderColor: currentSection === 'files' ? 'primary.main' : alpha(theme.palette.divider, 0.3),
                  bgcolor: currentSection === 'files' ? 'primary.main' : 'transparent'
                }}
              >
                Files
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Security />}
                onClick={() => setCurrentSection('security')}
                sx={{ 
                  py: 1.2, 
                  borderRadius: 2, 
                  justifyContent: 'flex-start', 
                  textTransform: 'none', 
                  color: currentSection === 'security' ? 'white' : 'primary.main', 
                  fontWeight: 700, 
                  borderColor: currentSection === 'security' ? 'primary.main' : alpha(theme.palette.divider, 0.3),
                  bgcolor: currentSection === 'security' ? 'primary.main' : 'transparent'
                }}
              >
                Security
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Settings />}
                onClick={() => setCurrentSection('settings')}
                sx={{ 
                  py: 1.2, 
                  borderRadius: 2, 
                  justifyContent: 'flex-start', 
                  textTransform: 'none', 
                  color: currentSection === 'settings' ? 'white' : 'primary.main', 
                  fontWeight: 700, 
                  borderColor: currentSection === 'settings' ? 'primary.main' : alpha(theme.palette.divider, 0.3),
                  bgcolor: currentSection === 'settings' ? 'primary.main' : 'transparent'
                }}
              >
                Settings
              </Button>
            </Stack>

            <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 2, color: 'primary.main' }}>
              QUICK STATS
            </Typography>

            <Stack spacing={2}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Total Users
                </Typography>
                <Typography variant="h5" fontWeight={900}>
                  {stats.totalUsers}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.success.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.success.main, 0.12)}`,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Active Now
                </Typography>
                <Typography variant="h5" fontWeight={900} color="success.main">
                  {stats.activeUsers}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 2, color: 'text.secondary' }}>
              ACCOUNT
            </Typography>

            <Stack spacing={1} sx={{ mb: 4 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Person />}
                onClick={() => {
                  handleUserMenuClose()
                  navigate('/profile')
                }}
                sx={{
                  py: 1.2,
                  borderRadius: 2,
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  fontWeight: 700,
                  color: 'primary.main',
                  borderColor: alpha(theme.palette.divider, 0.3),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                Profile Settings
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<Logout />}
                onClick={handleLogout}
                sx={{
                  py: 1.2,
                  borderRadius: 2,
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  fontWeight: 700,
                  color: 'primary.main',
                  borderColor: alpha(theme.palette.divider, 0.3),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                Logout
              </Button>
            </Stack>
          </Box>
        </Paper>

        {/* Main */}
        <Box sx={{ flex: 1 }}>
          <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
            {currentSection === 'overview' ? (
              <>
                {/* Header */}
                <Paper
                  sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.04)} 100%)`,
                    border: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 48, height: 48 }}>
                          <AdminPanelSettings />
                        </Avatar>
                        <Box>
                          <Typography variant="h3" fontWeight={950} sx={{ letterSpacing: -1 }}>
                            Admin Dashboard
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            Advanced platform management and real-time monitoring
                          </Typography>
                        </Box>
                      </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Chip icon={<AccessTime />} label={`Last updated: ${new Date().toLocaleTimeString()}`} size="small" variant="outlined" />
                    <Chip
                      icon={<MonitorHeart />}
                      label={`System Health: ${stats.systemHealth}%`}
                      color={stats.systemHealth >= 90 ? 'success' : stats.systemHealth >= 70 ? 'warning' : 'error'}
                      size="small"
                    />
                    <Chip icon={<Group />} label={`${stats.activeUsers} Active Users`} color="primary" size="small" />

                    <FormControlLabel
                      control={<Switch checked={realTimeMode} onChange={(e) => setRealTimeMode(e.target.checked)} />}
                      label="Real-time Mode"
                      sx={{ ml: 'auto' }}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                  <Tooltip title="Refresh Data">
                    <IconButton
                      onClick={() => fetchAdminData()}
                      sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}
                    >
                      <Refresh />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="System Settings">
                    <IconButton sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}>
                      <Settings />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Notifications">
                    <IconButton sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}>
                      <Badge badgeContent={stats.securityAlerts} color="error">
                        <Notifications />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary">
                  Time Range:
                </Typography>
                {['1h', '24h', '7d', '30d'].map((range) => (
                  <Chip
                    key={range}
                    label={range}
                    onClick={() => setSelectedTimeRange(range)}
                    color={selectedTimeRange === range ? 'primary' : 'default'}
                    variant={selectedTimeRange === range ? 'filled' : 'outlined'}
                    size="small"
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Paper>

            {/* Stat Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <ModernStatCard
                  title="Total Users"
                  value={stats.totalUsers}
                  icon={<ManageAccounts />}
                  color="primary"
                  subtitle="Registered clients"
                  trend={stats.monthlyGrowth}
                  onClick={() => navigate('/admin/clients')}
                  isLoading={refreshing}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <ModernStatCard
                  title="Total Files"
                  value={stats.totalFiles}
                  icon={<StorageIcon />}
                  color="secondary"
                  subtitle="Documents uploaded"
                  trend={12}
                  isLoading={refreshing}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <ModernStatCard
                  title="Total Reports"
                  value={stats.totalReports}
                  icon={<AssessmentIcon />}
                  color="success"
                  subtitle="Generated reports"
                  trend={8}
                  isLoading={refreshing}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <ModernStatCard
                  title="Active Users"
                  value={stats.activeUsers}
                  icon={<Timeline />}
                  color="info"
                  subtitle="Last 24 hours"
                  trend={5}
                  isLoading={refreshing}
                />
              </Grid>
            </Grid>

            {/* Second Row - Portfolio & Asset Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <ModernStatCard
                  title="Total Portfolios"
                  value={allPortfolios.length}
                  icon={<Business />}
                  color="warning"
                  subtitle="Managed portfolios"
                  trend={15}
                  isLoading={refreshing}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <ModernStatCard
                  title="Total Assets"
                  value={allPortfolios.reduce((sum, p) => sum + (p.assets?.length || 0), 0)}
                  icon={<AssessmentIcon />}
                  color="info"
                  subtitle="All portfolio assets"
                  trend={12}
                  isLoading={refreshing}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <ModernStatCard
                  title="Solar Assets"
                  value={allPortfolios.reduce((sum, p) => 
                    sum + (p.assets?.filter(a => a.hasSolar).length || 0), 0
                  )}
                  icon={<EnergySavingsLeaf />}
                  color="success"
                  subtitle="Renewable energy assets"
                  trend={25}
                  isLoading={refreshing}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <ModernStatCard
                  title="Total Emissions"
                  value={stats.totalEmissions.toFixed(0)}
                  icon={<CloudUpload />}
                  color="error"
                  subtitle="tCO₂e across all assets"
                  trend={-5}
                  isLoading={refreshing}
                />
              </Grid>
            </Grid>

            {/* AI-Powered Analytics Section */}
            <Paper
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 3,
                border: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.01)} 100%)`,
                boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <EnergySavingsLeaf sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
                <Box>
                  <Typography variant="h6" fontWeight={900}>
                    AI-Powered ESG Analytics
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Predictive insights, risk assessment, and intelligent recommendations
                  </Typography>
                </Box>
              </Box>

              {/* AI Components */}
              <Box sx={{ mb: 3 }}>
                <AIPredictionsPanel clientId={allClients[0]?.username || 'demo'} portfolioId={allPortfolios[0]?.id || 'demo'} />
              </Box>

              <Box sx={{ mb: 3 }}>
                <AIRecommendationsPanel clientId={allClients[0]?.username || 'demo'} />
              </Box>
            </Paper>

            {/* AI Document Analysis & Report Generation */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: `2px solid ${alpha(theme.palette.info.main, 0.15)}`,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.02)} 0%, ${alpha(theme.palette.info.main, 0.01)} 100%)`,
                    boxShadow: `0 4px 20px ${alpha(theme.palette.info.main, 0.08)}`,
                  }}
                >
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    📄 AI Document Analyzer
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Upload ESG documents for AI-powered analysis, compliance checking, and insights extraction
                  </Typography>
                  <AIDocumentAnalyzer />
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: `2px solid ${alpha(theme.palette.success.main, 0.15)}`,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.02)} 0%, ${alpha(theme.palette.success.main, 0.01)} 100%)`,
                    boxShadow: `0 4px 20px ${alpha(theme.palette.success.main, 0.08)}`,
                  }}
                >
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    📊 AI Report Generator
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Generate comprehensive ESG reports with AI-driven insights, predictions, and recommendations
                  </Typography>
                  <AIReportGenerator clientId={allClients[0]?.username || 'demo'} />
                </Paper>
              </Grid>
            </Grid>

            {/* Clients Management Section */}
            {activeSection === 'clients' && (
              <Paper
                sx={{
                  p: 3,
                  mb: 4,
                  borderRadius: 3,
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                  background: theme.palette.background.paper,
                  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ManageAccounts sx={{ mr: 2, color: theme.palette.primary.main, fontSize: 28 }} />
                    <Box>
                      <Typography variant="h6" fontWeight={900}>
                        Manage Clients
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        View and manage all registered clients
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Client</TableCell>
                        <TableCell align="center">Portfolios</TableCell>
                        <TableCell align="center">Assets</TableCell>
                        <TableCell align="center">Files</TableCell>
                        <TableCell align="center">Reports</TableCell>
                        <TableCell align="center">ESG Score</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {topClients.map((client) => (
                        <TableRow key={client.id} hover>
                          <TableCell>
                            <Box>
                              <Typography
                                variant="body2"
                                fontWeight={900}
                                sx={{
                                  cursor: 'pointer',
                                  color: 'primary.main',
                                  '&:hover': { textDecoration: 'underline' },
                                }}
                                onClick={() => handleClientClick(client.id)}
                              >
                                {client.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {client.email}
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell align="center">
                            <Chip 
                              label={(client.portfolio_access || []).length} 
                              size="small" 
                              variant="outlined"
                              sx={{ fontWeight: 700 }}
                            />
                          </TableCell>

                          <TableCell align="center">
                            <Chip 
                              label={client.assets_count} 
                              size="small" 
                              variant="outlined"
                              sx={{ fontWeight: 700 }}
                            />
                          </TableCell>

                          <TableCell align="center">
                            <Typography variant="body2" fontWeight={700}>
                              {client.files}
                            </Typography>
                          </TableCell>

                          <TableCell align="center">
                            <Typography variant="body2" fontWeight={700}>
                              {client.reports}
                            </Typography>
                          </TableCell>

                          <TableCell align="center">
                            <Chip 
                              label={`${client.esgScore}/100`} 
                              size="small" 
                              color={client.esgScore >= 75 ? 'success' : client.esgScore >= 50 ? 'warning' : 'error'}
                              sx={{ fontWeight: 700 }}
                            />
                          </TableCell>

                          <TableCell align="center">
                            <Chip 
                              label={client.status} 
                              size="small" 
                              color={client.status === 'active' ? 'success' : 'default'}
                              variant={client.status === 'active' ? 'filled' : 'outlined'}
                            />
                          </TableCell>

                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <Tooltip title="View Details">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleClientClick(client.id)}
                                  sx={{ color: 'primary.main' }}
                                >
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit">
                                <IconButton 
                                  size="small"
                                  onClick={() => handleEditClient(client)}
                                  sx={{ color: 'info.main' }}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton 
                                  size="small"
                                  onClick={() => handleDeleteClient(client.username)}
                                  sx={{ color: 'error.main' }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}

            {/* Portfolios Management Section */}
            {activeSection === 'portfolios' && (
              <Paper
                sx={{
                  p: 3,
                  mb: 4,
                  borderRadius: 3,
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                  background: theme.palette.background.paper,
                  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Business sx={{ mr: 2, color: theme.palette.primary.main }} />
                    <Box>
                      <Typography variant="h6" fontWeight={900}>
                        Client Portfolios
                        {autoRefreshing && (
                          <CircularProgress size={16} sx={{ ml: 1 }} />
                        )}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Manage all client portfolios and their assets
                        {lastPortfolioRefresh && (
                          <span> • Last updated: {lastPortfolioRefresh.toLocaleTimeString()}</span>
                        )}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip 
                      size="small" 
                      icon={<Refresh fontSize="small" />}
                      label="Auto-refresh: 30s"
                      color="success" 
                      variant="outlined"
                    />
                    <Button
                      variant="outlined"
                      startIcon={<Refresh />}
                      onClick={() => fetchPortfoliosFromDB(false)}
                      disabled={loadingPortfolios || autoRefreshing}
                      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                    >
                      Refresh
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<CloudUpload />}
                      onClick={() => setNewPortfolioOpen(true)}
                      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                    >
                      Create Portfolio
                    </Button>
                  </Box>
                </Box>

                <TableContainer>
                  {loadingPortfolios ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                      <CircularProgress size={40} />
                      <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
                        Loading portfolios from database...
                      </Typography>
                    </Box>
                  ) : (
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Portfolio Name</TableCell>
                          <TableCell align="center">Assets</TableCell>
                          <TableCell align="center">Status</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {allPortfolios.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                              <Typography variant="body2" color="text.secondary">
                                No portfolios found in database. {dbPortfolios.length === 0 ? 'Create your first portfolio to get started.' : ''}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          allPortfolios.map((portfolio) => (
                            <TableRow key={portfolio.id || portfolio._id} hover>
                              <TableCell>
                                <Box>
                                  <Typography variant="body2" fontWeight={700}>
                                    {portfolio.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    ID: {portfolio.id || portfolio._id}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="body2" fontWeight={700}>
                                  {portfolio.assets?.length || portfolio.asset_count || 0}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Chip 
                                  label={portfolio.status === 'active' ? 'Active' : portfolio.status || 'Unknown'} 
                                  size="small" 
                                  color={portfolio.status === 'active' ? 'success' : 'default'} 
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                                  <Tooltip title="View Portfolio">
                                    <IconButton 
                                      size="small"
                                      onClick={() => handleViewPortfolio(portfolio)}
                                    >
                                      <Visibility fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Edit Portfolio">
                                    <IconButton 
                                      size="small"
                                      onClick={() => {
                                        setSelectedPortfolio(portfolio)
                                        setPortfolioDetailsOpen(true)
                                        setIsEditingPortfolio(true)
                                      }}
                                    >
                                      <Edit fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete Portfolio">
                                    <IconButton 
                                      size="small" 
                                      sx={{ color: 'error.main' }}
                                      onClick={() => handleDeletePortfolio(portfolio)}
                                    >
                                      <Delete fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  )}
                </TableContainer>
              </Paper>
            )}

            {/* Main Grid */}
            {activeSection === 'dashboard' && (
            <Grid container spacing={3}>
              {/* Growth Chart */}
              <Grid item xs={12}>
                    <Paper
                      sx={{
                        p: 3,
                        minHeight: 400,
                        borderRadius: 3,
                        border: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                        background: theme.palette.background.paper,
                        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Timeline sx={{ mr: 2, color: theme.palette.primary.main }} />
                          <Box>
                            <Typography variant="h6" fontWeight={900}>
                              User Growth Analytics
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Monthly user acquisition and activity trends
                            </Typography>
                          </Box>
                        </Box>
                        <Chip label="6 Months" size="small" variant="outlined" />
                      </Box>

                      <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={userGrowthData}>
                          <defs>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#1976D2" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#1976D2" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#388E3C" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#388E3C" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>

                          <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.2)} />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary }} />
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: theme.palette.background.paper,
                              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                              borderRadius: 8,
                              boxShadow: theme.shadows[2],
                            }}
                          />
                          <Legend wrapperStyle={{ paddingTop: 20 }} />
                          <Area type="monotone" dataKey="users" stroke="#1976D2" fill="url(#colorUsers)" strokeWidth={2} name="Total Users" />
                          <Area type="monotone" dataKey="activeUsers" stroke="#388E3C" fill="url(#colorActive)" strokeWidth={2} name="Active Users" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>

                  {/* Recent Activity */}
                  <Grid item xs={12}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 4,
                        border: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                        background: theme.palette.background.paper,
                        minHeight: 400,
                        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'success.main' }}>
                          <Timeline />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight={900}>
                            Recent Activity
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Latest platform activities
                          </Typography>
                        </Box>
                      </Box>

                      <List sx={{ p: 0 }}>
                        {recentActivity.map((activity) => (
                          <ListItem key={activity.id} sx={{ px: 0, py: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  mr: 2,
                                  bgcolor:
                                    activity.type === 'report'
                                      ? 'primary.main'
                                      : activity.type === 'upload'
                                      ? 'success.main'
                                      : activity.type === 'user'
                                      ? 'info.main'
                                      : 'warning.main',
                                }}
                              >
                                {activity.type === 'report' ? (
                                  <AssessmentIcon fontSize="small" />
                                ) : activity.type === 'upload' ? (
                                  <StorageIcon fontSize="small" />
                                ) : activity.type === 'user' ? (
                                  <PeopleIcon fontSize="small" />
                                ) : (
                                  <Download fontSize="small" />
                                )}
                              </Avatar>

                              <Box sx={{ flex: 1 }}>
                                {/* ✅ fixed: action not title */}
                                <Typography variant="body2" fontWeight={700}>
                                  {activity.action}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {activity.user} • {activity.time}
                                </Typography>
                              </Box>
                            </Box>
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Grid>

              {/* Top Clients */}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                    background: theme.palette.background.paper,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Business sx={{ mr: 2, color: theme.palette.secondary.main }} />
                      <Box>
                        <Typography variant="h6" fontWeight={900}>
                          Top Performing Clients
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Clients ranked by activity and ESG performance
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="outlined"
                      endIcon={<OpenInNew />}
                      onClick={() => navigate('/admin/clients')}
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                      View All
                    </Button>
                  </Box>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Client</TableCell>
                          <TableCell align="center">Portfolios</TableCell>
                          <TableCell align="center">Assets</TableCell>
                          <TableCell align="center">Files</TableCell>
                          <TableCell align="center">Reports</TableCell>
                          <TableCell align="center">ESG Score</TableCell>
                          <TableCell align="center">Growth</TableCell>
                          <TableCell align="center">Status</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {topClients.map((client) => (
                          <TableRow key={client.id} hover>
                            <TableCell>
                              <Box>
                                <Typography
                                  variant="body2"
                                  fontWeight={900}
                                  sx={{
                                    cursor: 'pointer',
                                    color: 'primary.main',
                                    '&:hover': { textDecoration: 'underline' },
                                  }}
                                  onClick={() => handleClientClick(client.id)}
                                >
                                  {client.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {client.email}
                                </Typography>
                              </Box>
                            </TableCell>

                            <TableCell align="center">
                              <Chip 
                                label={(client.portfolio_access || []).length} 
                                size="small" 
                                variant="outlined"
                                sx={{ fontWeight: 700 }}
                              />
                            </TableCell>

                            <TableCell align="center">
                              <Chip 
                                label={client.assets_count} 
                                size="small" 
                                variant="outlined"
                                sx={{ fontWeight: 700 }}
                              />
                            </TableCell>

                            <TableCell align="center">{client.files}</TableCell>
                            <TableCell align="center">{client.reports}</TableCell>

                            <TableCell align="center">
                              <Chip
                                label={client.esgScore}
                                size="small"
                                color={client.esgScore >= 80 ? 'success' : client.esgScore >= 60 ? 'warning' : 'error'}
                                sx={{ fontWeight: 900 }}
                              />
                            </TableCell>

                            <TableCell align="center">
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {client.growth >= 0 ? (
                                  <ArrowUpward sx={{ color: 'success.main', fontSize: 16 }} />
                                ) : (
                                  <ArrowDownward sx={{ color: 'error.main', fontSize: 16 }} />
                                )}
                                <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 700 }}>
                                  {Math.abs(client.growth)}%
                                </Typography>
                              </Box>
                            </TableCell>

                            <TableCell align="center">
                              <Chip label={client.status} size="small" color="success" variant="outlined" />
                            </TableCell>

                            <TableCell align="center">
                              <IconButton size="small" onClick={() => handleOpenUserProfile(client)} title="View User Profile">
                                <Person fontSize="small" />
                              </IconButton>
                              <IconButton size="small" title="View Client">
                                <Visibility fontSize="small" />
                              </IconButton>
                              <IconButton size="small" title="Edit Client">
                                <Edit fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>

              {/* Comprehensive Asset Management */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, ...surfaceCard }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Business sx={{ mr: 2, color: theme.palette.secondary.main }} />
                      <Box>
                        <Typography variant="h6" fontWeight={900}>
                          🏭 Complete Asset Management
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          All assets across all portfolios with real-time management
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="outlined"
                      endIcon={<Refresh />}
                      onClick={() => setRefreshing(!refreshing)}
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                      Refresh Assets
                    </Button>
                  </Box>

                  {/* Asset Summary Cards */}
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="h4" fontWeight={900} color="primary.main">
                              {stats.totalAssets}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Total Assets
                            </Typography>
                          </Box>
                          <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                            <Business />
                          </Avatar>
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card sx={{ p: 2, bgcolor: alpha(theme.palette.success.main, 0.05), border: `1px solid ${alpha(theme.palette.success.main, 0.1)}` }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="h4" fontWeight={900} color="success.main">
                              {allPortfolios.flatMap(p => p.assets || []).filter(a => a.hasSolar).length}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Solar Assets
                            </Typography>
                          </Box>
                          <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                            ☀️
                          </Avatar>
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card sx={{ p: 2, bgcolor: alpha(theme.palette.warning.main, 0.05), border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}` }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="h4" fontWeight={900} color="warning.main">
                              {stats.totalEmissions.toFixed(0)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Total tCO₂e
                            </Typography>
                          </Box>
                          <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                            🌍
                          </Avatar>
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), border: `1px solid ${alpha(theme.palette.info.main, 0.1)}` }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="h4" fontWeight={900} color="info.main">
                              {stats.totalPortfolios}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Portfolios
                            </Typography>
                          </Box>
                          <Avatar sx={{ bgcolor: 'info.light', color: 'info.main' }}>
                            📁
                          </Avatar>
                        </Box>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Detailed Asset Table */}
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 900 }}>Asset Name</TableCell>
                          <TableCell sx={{ fontWeight: 900 }}>Portfolio</TableCell>
                          <TableCell sx={{ fontWeight: 900 }}>Client</TableCell>
                          <TableCell sx={{ fontWeight: 900 }} align="center">EPC Grade</TableCell>
                          <TableCell sx={{ fontWeight: 900 }} align="center">Solar</TableCell>
                          <TableCell sx={{ fontWeight: 900 }} align="center">Energy (kWh/m²a)</TableCell>
                          <TableCell sx={{ fontWeight: 900 }} align="center">Emissions (tCO₂e)</TableCell>
                          <TableCell sx={{ fontWeight: 900 }} align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {allPortfolios.map(portfolio => 
                          (portfolio.assets || []).map(asset => {
                            const client = allClients.find(c => (c.portfolio_access || []).includes(portfolio.id))
                            return (
                              <TableRow key={asset.id} hover>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: asset.hasSolar ? 'success.light' : 'primary.light' }}>
                                      {asset.hasSolar ? '☀️' : '⚡'}
                                    </Avatar>
                                    <Box>
                                      <Typography variant="body2" fontWeight={600}>
                                        {asset.name}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {asset.type}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {portfolio.name}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {client?.full_name || 'Unassigned'}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Chip
                                    label={asset.epcGrade}
                                    size="small"
                                    color={
                                      asset.epcGrade === 'A' || asset.epcGrade === 'B' ? 'success' : 
                                      asset.epcGrade === 'C' || asset.epcGrade === 'D' ? 'warning' : 'error'
                                    }
                                    sx={{ fontWeight: 700, minWidth: 40 }}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <Typography variant="body2">
                                    {asset.hasSolar ? '☀️ Yes' : '⚡ No'}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Typography variant="body2" fontWeight={600}>
                                    {asset.energyPerformance_kwh_m2a}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Typography variant="body2" fontWeight={600}>
                                    {asset.emissions_tco2e ? asset.emissions_tco2e.toFixed(1) : '0.0'}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <IconButton size="small" title="View Asset Details">
                                    <Visibility fontSize="small" />
                                  </IconButton>
                                  <IconButton size="small" title="Edit Asset">
                                    <Edit fontSize="small" />
                                  </IconButton>
                                  <IconButton size="small" title="Manage Asset">
                                    <Settings fontSize="small" />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            )
                          })
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
            )}

            {/* Floating Action Button */}
            {/* Floating Action Button - Changes based on active section */}
            {activeSection === 'clients' && (
              <Fab
                color="primary"
                aria-label="add-user"
                sx={{
                  position: 'fixed',
                  bottom: 32,
                  right: 32,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                    transform: 'scale(1.07)',
                  },
                  transition: 'transform 0.2s',
                }}
                onClick={() => setNewClientOpen(true)}
              >
                <ManageAccounts />
              </Fab>
            )}
            
            {activeSection === 'portfolios' && (
              <Fab
                color="primary"
                aria-label="add-portfolio"
                sx={{
                  position: 'fixed',
                  bottom: 32,
                  right: 32,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                    transform: 'scale(1.07)',
                  },
                  transition: 'transform 0.2s',
                }}
                onClick={() => setNewPortfolioOpen(true)}
              >
                <Business />
              </Fab>
            )}
              </>
            ) : currentSection === 'reports' ? (
              <>
                <Paper
                  sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.04)} 100%)`,
                    border: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 48, height: 48 }}>
                      <AssessmentIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h3" fontWeight={950} sx={{ letterSpacing: -1 }}>
                        System Reports
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Comprehensive system monitoring and analytics reports
                      </Typography>
                    </Box>
                  </Box>
                </Paper>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                      <HealthAndSafety sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                        System Health
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Monitor system performance, uptime, and resource utilization
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                      <PeopleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                        User Activity
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Track user login patterns and system interactions
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                      <Security sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                        Security Logs
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Review security events and threat monitoring
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </>
            ) : currentSection === 'files' ? (
              <>
                <Paper
                  sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.04)} 100%)`,
                    border: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 48, height: 48 }}>
                      <StorageIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h3" fontWeight={950} sx={{ letterSpacing: -1 }}>
                        File Management
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Upload, organize, and manage system files and documents
                      </Typography>
                    </Box>
                  </Box>
                </Paper>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                      <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                        Upload Files
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Upload new documents, reports, and system files
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                      <StorageIcon sx={{ fontSize: 64, color: 'secondary.main', mb: 2 }} />
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                        File Storage
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Manage existing files, folders, and storage usage
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </>
            ) : currentSection === 'security' ? (
              <>
                <Paper
                  sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.04)} 100%)`,
                    border: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 48, height: 48 }}>
                      <Security />
                    </Avatar>
                    <Box>
                      <Typography variant="h3" fontWeight={950} sx={{ letterSpacing: -1 }}>
                        Security Management
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Monitor and manage system security and access control
                      </Typography>
                    </Box>
                  </Box>
                </Paper>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                      <Security sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                        Threat Detection
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Monitor security threats and system vulnerabilities
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                      <AdminPanelSettings sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                        Access Control
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Manage user permissions and role-based access
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                      <BugReport sx={{ fontSize: 64, color: 'info.main', mb: 2 }} />
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                        Audit Logs
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Review system audit trails and activity logs
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </>
            ) : currentSection === 'settings' ? (
              <>
                <Paper
                  sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.04)} 100%)`,
                    border: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 48, height: 48 }}>
                      <Settings />
                    </Avatar>
                    <Box>
                      <Typography variant="h3" fontWeight={950} sx={{ letterSpacing: -1 }}>
                        System Settings
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Configure system preferences and administrative settings
                      </Typography>
                    </Box>
                  </Box>
                </Paper>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                      <Settings sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                        General Settings
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        System-wide configuration and preferences
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                      <SystemUpdate sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                        System Updates
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Manage system updates and maintenance schedules
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </>
            ) : null}
          </Container>

          {/* ✅ Dialogs are OUTSIDE Container — prevents the "missing </Container>" cascade */}
          {/* Create New Client Dialog */}
          <Dialog
            open={newClientOpen}
            onClose={() => setNewClientOpen(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}
          >
            <DialogTitle sx={{ fontWeight: 900, pb: 1, display: 'flex', alignItems: 'center' }}>
              <ManageAccounts sx={{ mr: 2, color: 'primary.main' }} />
              Create New Client
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1, color: 'text.primary' }}>
                    Full Name *
                  </Typography>
                  <input
                    type="text"
                    placeholder="e.g., John Doe"
                    value={newClientData.full_name}
                    onChange={(e) => handleUpdateNewClientField('full_name', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '6px',
                      border: `1.5px solid ${theme.palette.divider}`,
                      fontFamily: 'inherit',
                      fontSize: '0.95rem',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s',
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1, color: 'text.primary' }}>
                    Username
                  </Typography>
                  <input
                    type="text"
                    placeholder="e.g., john-doe"
                    value={newClientData.username}
                    onChange={(e) => handleUpdateNewClientField('username', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '6px',
                      border: `1.5px solid ${theme.palette.divider}`,
                      fontFamily: 'inherit',
                      fontSize: '0.95rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1, color: 'text.primary' }}>
                    Email Address *
                  </Typography>
                  <input
                    type="email"
                    placeholder="e.g., john@example.com"
                    value={newClientData.email}
                    onChange={(e) => handleUpdateNewClientField('email', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '6px',
                      border: `1.5px solid ${theme.palette.divider}`,
                      fontFamily: 'inherit',
                      fontSize: '0.95rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1, color: 'text.primary' }}>
                    Status
                  </Typography>
                  <select
                    value={newClientData.status}
                    onChange={(e) => handleUpdateNewClientField('status', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '6px',
                      border: `1.5px solid ${theme.palette.divider}`,
                      fontFamily: 'inherit',
                      fontSize: '0.95rem',
                      boxSizing: 'border-box',
                      backgroundColor: theme.palette.background.paper,
                    }}
                  >
                    <option value="active">🟢 Active</option>
                    <option value="inactive">⚫ Inactive</option>
                    <option value="pending">🟡 Pending</option>
                  </select>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.12)}` }}>
              <Button 
                onClick={() => setNewClientOpen(false)} 
                variant="outlined"
                sx={{ textTransform: 'none', fontWeight: 700 }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateNewClient} 
                variant="contained"
                disabled={!newClientData.full_name || !newClientData.email}
                sx={{ textTransform: 'none', fontWeight: 700 }}
              >
                Create Client
              </Button>
            </DialogActions>
          </Dialog>

          {/* Client Details Dialog */}
          <Dialog
            open={clientDetailsOpen}
            onClose={handleCloseClientDetails}
            maxWidth="lg"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3, minHeight: 600 } }}
          >
            {selectedClient ? (
              <>
                <DialogTitle sx={{ pb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ width: 48, height: 48, mr: 2, bgcolor: 'primary.main' }}>
                        <Business />
                      </Avatar>
                      <Box>
                        <Typography variant="h5" fontWeight={900}>
                          {selectedClient.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedClient.industry} • {selectedClient.subscription} Plan
                        </Typography>
                      </Box>
                    </Box>

                    <Chip label={selectedClient.status} color="success" variant="outlined" sx={{ fontWeight: 800 }} />
                  </Box>
                </DialogTitle>

                <DialogContent sx={{ pt: 0 }}>
                  <Tabs value={detailsTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                    <Tab label="Overview" />
                    <Tab label="Portfolios & Assets" />
                    <Tab label="ESG Performance" />
                    <Tab label="Reports" />
                    <Tab label="Activity" />
                  </Tabs>

                  {detailsTab === 0 && (
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, height: '100%', borderRadius: 3 }}>
                          <Typography variant="h6" fontWeight={900} gutterBottom>
                            Company Information
                          </Typography>
                          <Stack spacing={1.5}>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Contact Person
                              </Typography>
                              <Typography variant="body2" fontWeight={700}>
                                {selectedClient.contactPerson}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Email
                              </Typography>
                              <Typography variant="body2" fontWeight={700}>
                                {selectedClient.email}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Phone
                              </Typography>
                              <Typography variant="body2" fontWeight={700}>
                                {selectedClient.phone}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Address
                              </Typography>
                              <Typography variant="body2" fontWeight={700}>
                                {selectedClient.address}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Website
                              </Typography>
                              <Typography variant="body2" fontWeight={800} color="primary.main">
                                {selectedClient.website}
                              </Typography>
                            </Box>
                          </Stack>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, height: '100%', borderRadius: 3 }}>
                          <Typography variant="h6" fontWeight={900} gutterBottom>
                            Business Details
                          </Typography>
                          <Stack spacing={1.5}>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Founded
                              </Typography>
                              <Typography variant="body2" fontWeight={700}>
                                {selectedClient.founded}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Employees
                              </Typography>
                              <Typography variant="body2" fontWeight={700}>
                                {selectedClient.employees}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Revenue
                              </Typography>
                              <Typography variant="body2" fontWeight={700}>
                                {selectedClient.revenue}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Member Since
                              </Typography>
                              <Typography variant="body2" fontWeight={700}>
                                {new Date(selectedClient.joinDate).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Stack>
                        </Paper>
                      </Grid>
                    </Grid>
                  )}

                  {detailsTab === 1 && (
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Paper sx={{ p: 3, borderRadius: 3 }}>
                          <Typography variant="h6" fontWeight={900} gutterBottom>
                            Portfolios & Assets Overview
                          </Typography>
                          
                          <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12} md={3}>
                              <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 2, textAlign: 'center' }}>
                                <Typography variant="h4" fontWeight={900} color="primary.main">
                                  {selectedClient.portfolios?.length || 0}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Total Portfolios
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <Box sx={{ p: 2, bgcolor: 'success.50', borderRadius: 2, textAlign: 'center' }}>
                                <Typography variant="h4" fontWeight={900} color="success.main">
                                  {selectedClient.assets?.length || 0}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Total Assets
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <Box sx={{ p: 2, bgcolor: 'warning.50', borderRadius: 2, textAlign: 'center' }}>
                                <Typography variant="h4" fontWeight={900} color="warning.main">
                                  {selectedClient.assets?.filter(a => a.hasSolar).length || 0}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Solar Assets
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <Box sx={{ p: 2, bgcolor: 'error.50', borderRadius: 2, textAlign: 'center' }}>
                                <Typography variant="h4" fontWeight={900} color="error.main">
                                  {selectedClient.emissions_tco2e?.toFixed(1) || '0.0'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Total Emissions (tCO₂e)
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>

                          {/* Portfolio Details */}
                          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                            Portfolio Details
                          </Typography>
                          {selectedClient.portfolios?.map((portfolio, index) => (
                            <Card key={portfolio.id} sx={{ mb: 2, p: 2, border: `1px solid ${alpha(theme.palette.divider, 0.12)}` }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Box>
                                  <Typography variant="h6" fontWeight={800}>
                                    {portfolio.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {portfolio.assetCount} assets • {portfolio.totalEmissions.toFixed(1)} tCO₂e total emissions
                                  </Typography>
                                </Box>
                                <Chip 
                                  label={`Avg EPC: ${Math.round(portfolio.avgEpcGrade)}`}
                                  size="small"
                                  color={portfolio.avgEpcGrade >= 80 ? 'success' : portfolio.avgEpcGrade >= 60 ? 'warning' : 'error'}
                                />
                              </Box>
                              
                              {/* Assets in this portfolio */}
                              <TableContainer>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Asset Name</TableCell>
                                      <TableCell>EPC Grade</TableCell>
                                      <TableCell align="right">Energy Performance</TableCell>
                                      <TableCell align="right">Emissions (tCO₂e)</TableCell>
                                      <TableCell align="center">Solar</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {portfolio.assets?.map((asset) => (
                                      <TableRow key={asset.id}>
                                        <TableCell>{asset.name}</TableCell>
                                        <TableCell>
                                          <Chip 
                                            label={asset.epcGrade} 
                                            size="small"
                                            color={
                                              asset.epcGrade === 'A' || asset.epcGrade === 'B' ? 'success' :
                                              asset.epcGrade === 'C' || asset.epcGrade === 'D' ? 'warning' : 'error'
                                            }
                                          />
                                        </TableCell>
                                        <TableCell align="right">{asset.energyPerformance_kwh_m2a}</TableCell>
                                        <TableCell align="right">{asset.emissions_tco2e?.toFixed(1) || '0.0'}</TableCell>
                                        <TableCell align="center">
                                          {asset.hasSolar ? '☀️' : '⚡'}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Card>
                          ))}
                        </Paper>
                      </Grid>
                    </Grid>
                  )}

                  {detailsTab === 2 && (
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Paper sx={{ p: 3, borderRadius: 3 }}>
                          <Typography variant="h6" fontWeight={900} gutterBottom>
                            ESG Performance Metrics
                          </Typography>

                          <Grid container spacing={2}>
                            {Object.entries(selectedClient.metrics).map(([key, metric]) => (
                              <Grid item xs={12} md={4} key={key}>
                                <Card sx={{ p: 2, borderRadius: 3, border: `1px solid ${alpha(theme.palette.divider, 0.15)}` }}>
                                  <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }} gutterBottom fontWeight={900}>
                                    {key}
                                  </Typography>

                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="h4" fontWeight={900} sx={{ mr: 1 }}>
                                      {metric.score}
                                    </Typography>
                                    <Chip
                                      label={metric.trend}
                                      size="small"
                                      color={metric.trend.startsWith('+') ? 'success' : 'error'}
                                      sx={{ fontWeight: 800 }}
                                    />
                                  </Box>

                                  <LinearProgress variant="determinate" value={metric.score} sx={{ mb: 1, height: 8, borderRadius: 8 }} />

                                  <Typography variant="caption" color="text.secondary">
                                    Status: {metric.status}
                                  </Typography>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                        </Paper>
                      </Grid>

                      <Grid item xs={12}>
                        <Paper sx={{ p: 3, borderRadius: 3 }}>
                          <Typography variant="h6" fontWeight={900} gutterBottom>
                            ESG Score History
                          </Typography>

                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Period</TableCell>
                                  <TableCell align="center">Score</TableCell>
                                  <TableCell align="center">Change</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {selectedClient.esgHistory.map((item) => (
                                  <TableRow key={item.period}>
                                    <TableCell>{item.period}</TableCell>
                                    <TableCell align="center">
                                      <Chip
                                        label={item.score}
                                        color={item.score >= 80 ? 'success' : item.score >= 60 ? 'warning' : 'error'}
                                        size="small"
                                        sx={{ fontWeight: 900 }}
                                      />
                                    </TableCell>
                                    <TableCell align="center">
                                      <Typography
                                        fontWeight={900}
                                        color={item.change.startsWith('+') ? 'success.main' : 'error.main'}
                                      >
                                        {item.change}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Paper>
                      </Grid>
                    </Grid>
                  )}

                  {detailsTab === 3 && (
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                      <Typography variant="h6" fontWeight={900} gutterBottom>
                        Recent Reports
                      </Typography>

                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Report Type</TableCell>
                              <TableCell>Period</TableCell>
                              <TableCell>Generated Date</TableCell>
                              <TableCell>ESG Score</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {selectedClient.recentReports.map((report) => (
                              <TableRow key={report.id}>
                                <TableCell>{report.reportType}</TableCell>
                                <TableCell>{report.period}</TableCell>
                                <TableCell>{new Date(report.generatedDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                  {report.esgScore != null ? (
                                    <Chip
                                      label={report.esgScore}
                                      color={report.esgScore >= 80 ? 'success' : report.esgScore >= 60 ? 'warning' : 'error'}
                                      size="small"
                                      sx={{ fontWeight: 900 }}
                                    />
                                  ) : (
                                    <Typography variant="body2" color="text.secondary">
                                      —
                                    </Typography>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Chip label={report.status} color={report.status === 'completed' ? 'success' : 'warning'} size="small" />
                                </TableCell>
                                <TableCell>
                                  <IconButton size="small" title="View">
                                    <Visibility fontSize="small" />
                                  </IconButton>
                                  <IconButton size="small" title="Download">
                                    <Download fontSize="small" />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  )}

                  {detailsTab === 4 && (
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 3, borderRadius: 3 }}>
                          <Typography variant="h6" fontWeight={900} gutterBottom>
                            Recent Activity
                          </Typography>
                          <List>
                            {selectedClient.activity.map((item, idx) => (
                              <ListItem key={idx} sx={{ borderLeft: 3, borderColor: 'primary.main', pl: 2 }}>
                                <Box>
                                  <Typography variant="body2" fontWeight={700}>
                                    {item.action}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {new Date(item.date).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </ListItem>
                            ))}
                          </List>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, borderRadius: 3 }}>
                          <Typography variant="h6" fontWeight={900} gutterBottom>
                            Document Categories
                          </Typography>

                          <Stack spacing={2}>
                            {Object.entries(selectedClient.documents.categories).map(([category, count]) => (
                              <Box key={category}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                  <Typography variant="body2" fontWeight={700}>
                                    {category}
                                  </Typography>
                                  <Typography variant="body2" fontWeight={900}>
                                    {count}
                                  </Typography>
                                </Box>

                                <LinearProgress
                                  variant="determinate"
                                  value={(count / selectedClient.documents.total) * 100}
                                  sx={{ height: 6, borderRadius: 6 }}
                                />
                              </Box>
                            ))}
                          </Stack>
                        </Paper>
                      </Grid>
                    </Grid>
                  )}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3 }}>
                  {isEditingClient ? (
                    <>
                      <Button onClick={handleCloseClientDetails} variant="outlined">
                        Cancel
                      </Button>
                      <Button onClick={handleSaveClient} variant="contained" color="primary">
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={handleCloseClientDetails} sx={{ textTransform: 'none' }}>
                        Close
                      </Button>
                      <Button variant="contained" startIcon={<Edit />} sx={{ textTransform: 'none', fontWeight: 900 }} onClick={() => handleEditClient(selectedClient)}>
                        Edit Client
                      </Button>
                    </>
                  )}
                </DialogActions>
              </>
            ) : null}
          </Dialog>

          <Dialog
            open={userProfileOpen}
            onClose={handleCloseUserProfile}
            maxWidth="xl"
            fullWidth
            PaperProps={{ sx: { borderRadius: 4, minHeight: 780 } }}
          >
            {selectedUserForProfile ? (
              <>
                <DialogTitle
                  sx={{
                    pb: 2,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
                        {selectedUserForProfile.name?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="h5" fontWeight={900}>
                          User Profile Management
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {userProfileData.personal.fullName} • {userProfileData.professional.jobTitle}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        icon={<VerifiedUser />}
                        label={userProfileData.professional.status}
                        color={userProfileData.professional.status === 'active' ? 'success' : 'warning'}
                        size="small"
                      />
                      <Chip icon={<Security />} label={userProfileData.professional.role} color="primary" size="small" />
                    </Box>
                  </Box>
                </DialogTitle>

                <DialogContent sx={{ p: 0 }}>
                  <Tabs
                    value={profileTab}
                    onChange={(e, v) => setProfileTab(v)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                      '& .MuiTab-root': { textTransform: 'none', fontWeight: 800, minWidth: 'auto', px: 3 },
                    }}
                  >
                    <Tab icon={<Person />} label="Personal" />
                    <Tab icon={<Business />} label="Professional" />
                    <Tab icon={<Security />} label="Security" />
                    <Tab icon={<History />} label="Activity" />
                  </Tabs>

                  {profileTab === 0 && (
                    <Box sx={{ p: 3 }}>
                      <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" fontWeight={900} mb={3}>
                          Personal Information
                        </Typography>

                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Typography variant="caption" color="text.secondary">
                              Full Name
                            </Typography>
                            {isEditingClient ? (
                              <TextField
                                fullWidth
                                size="small"
                                value={selectedClient.full_name || ''}
                                onChange={(e) => setSelectedClient(prev => ({ ...prev, full_name: e.target.value }))}
                                sx={{ mt: 0.5 }}
                              />
                            ) : (
                              <Typography variant="body1" fontWeight={800}>
                                {selectedClient.full_name}
                              </Typography>
                            )}
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="caption" color="text.secondary">
                              Username
                            </Typography>
                            {isEditingClient ? (
                              <TextField
                                fullWidth
                                size="small"
                                value={selectedClient.username || ''}
                                onChange={(e) => setSelectedClient(prev => ({ ...prev, username: e.target.value }))}
                                sx={{ mt: 0.5 }}
                              />
                            ) : (
                              <Typography variant="body1" fontWeight={800}>
                                {selectedClient.username}
                              </Typography>
                            )}
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="caption" color="text.secondary">
                              Email
                            </Typography>
                            {isEditingClient ? (
                              <TextField
                                fullWidth
                                size="small"
                                type="email"
                                value={selectedClient.email || ''}
                                onChange={(e) => setSelectedClient(prev => ({ ...prev, email: e.target.value }))}
                                sx={{ mt: 0.5 }}
                              />
                            ) : (
                              <Typography variant="body1" fontWeight={800}>
                                {selectedClient.email}
                              </Typography>
                            )}
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="caption" color="text.secondary">
                              Phone
                            </Typography>
                            {isEditingClient ? (
                              <TextField
                                fullWidth
                                size="small"
                                value={selectedClient.phone || ''}
                                onChange={(e) => setSelectedClient(prev => ({ ...prev, phone: e.target.value }))}
                                sx={{ mt: 0.5 }}
                              />
                            ) : (
                              <Typography variant="body1" fontWeight={800}>
                                {selectedClient.phone}
                              </Typography>
                            )}
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="caption" color="text.secondary">
                              Address
                            </Typography>
                            {isEditingClient ? (
                              <TextField
                                fullWidth
                                size="small"
                                value={selectedClient.address || ''}
                                onChange={(e) => setSelectedClient(prev => ({ ...prev, address: e.target.value }))}
                                sx={{ mt: 0.5 }}
                              />
                            ) : (
                              <Typography variant="body1" fontWeight={800}>
                                {selectedClient.address}
                              </Typography>
                            )}
                          </Grid>
                        </Grid>
                      </Paper>
                    </Box>
                  )}

                  {profileTab === 1 && (
                    <Box sx={{ p: 3 }}>
                      <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" fontWeight={900} mb={3}>
                          Professional Information
                        </Typography>

                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Typography variant="caption" color="text.secondary">
                              Company
                            </Typography>
                            <Typography variant="body1" fontWeight={800}>
                              {userProfileData.professional.company}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="caption" color="text.secondary">
                              Job Title
                            </Typography>
                            <Typography variant="body1" fontWeight={800}>
                              {userProfileData.professional.jobTitle}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="caption" color="text.secondary">
                              Department
                            </Typography>
                            <Typography variant="body1" fontWeight={800}>
                              {userProfileData.professional.department}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="caption" color="text.secondary">
                              Subscription
                            </Typography>
                            <Typography variant="body1" fontWeight={800}>
                              {userProfileData.professional.subscription}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Box>
                  )}

                  {profileTab === 2 && (
                    <Box sx={{ p: 3 }}>
                      <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" fontWeight={900} mb={3}>
                          Security Overview
                        </Typography>

                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" fontWeight={700}>
                              Security Score
                            </Typography>
                            <Chip
                              label={`${userProfileData.security.securityScore}%`}
                              color={userProfileData.security.securityScore >= 80 ? 'success' : 'warning'}
                              size="small"
                            />
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={userProfileData.security.securityScore || 0}
                            sx={{ height: 8, borderRadius: 8 }}
                          />
                          <Divider />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" fontWeight={700}>
                              2FA Enabled
                            </Typography>
                            <Chip
                              label={userProfileData.security.twoFactorEnabled ? 'Yes' : 'No'}
                              color={userProfileData.security.twoFactorEnabled ? 'success' : 'error'}
                              size="small"
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" fontWeight={700}>
                              Active Sessions
                            </Typography>
                            <Typography variant="body2" fontWeight={900}>
                              {userProfileData.security.activeSessions}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </Box>
                  )}

                  {profileTab === 3 && (
                    <Box sx={{ p: 3 }}>
                      <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" fontWeight={900} mb={3}>
                          Activity Log
                        </Typography>

                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Action</TableCell>
                                <TableCell>Details</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Timestamp</TableCell>
                                <TableCell>IP Address</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {userProfileData.activity.map((a) => (
                                <TableRow key={a.id}>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      {a.type === 'login' ? <LockOpen fontSize="small" /> : a.type === 'failed_login' ? <Lock fontSize="small" /> : <CloudUpload fontSize="small" />}
                                      <Typography variant="body2" fontWeight={800}>
                                        {a.action}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                      {a.details}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Chip label={a.status} color={a.status === 'success' ? 'success' : 'error'} size="small" />
                                  </TableCell>
                                  <TableCell>{new Date(a.timestamp).toLocaleString()}</TableCell>
                                  <TableCell>{a.ipAddress}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    </Box>
                  )}
                </DialogContent>

                <DialogActions sx={{ p: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.12)}` }}>
                  <Button onClick={handleCloseUserProfile} sx={{ textTransform: 'none' }}>
                    Close
                  </Button>
                  <Button variant="contained" startIcon={<Save />} sx={{ textTransform: 'none', fontWeight: 900 }}>
                    Save Changes
                  </Button>
                </DialogActions>
              </>
            ) : null}
          </Dialog>

          {/* Create New Portfolio Dialog */}
          <Dialog
            open={newPortfolioOpen}
            onClose={() => setNewPortfolioOpen(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}
          >
            <DialogTitle sx={{ fontWeight: 900, pb: 1, display: 'flex', alignItems: 'center' }}>
              <Business sx={{ mr: 2, color: 'primary.main' }} />
              Create New Portfolio
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1, color: 'text.primary' }}>
                    Portfolio Name *
                  </Typography>
                  <input
                    type="text"
                    placeholder="e.g., Office Building Portfolio"
                    value={newPortfolioData.name}
                    onChange={(e) => handleUpdateNewPortfolioField('name', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '6px',
                      border: `1.5px solid ${theme.palette.divider}`,
                      fontFamily: 'inherit',
                      fontSize: '0.95rem',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s',
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1, color: 'text.primary' }}>
                    Client *
                  </Typography>
                  <select
                    value={newPortfolioData.clientId}
                    onChange={(e) => handleUpdateNewPortfolioField('clientId', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '6px',
                      border: `1.5px solid ${theme.palette.divider}`,
                      fontFamily: 'inherit',
                      fontSize: '0.95rem',
                      boxSizing: 'border-box',
                      backgroundColor: theme.palette.background.paper,
                    }}
                  >
                    <option value="">Select a client...</option>
                    {allClients.map((client) => (
                      <option key={client.username} value={client.username}>
                        {client.full_name || client.username}
                      </option>
                    ))}
                  </select>
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1, color: 'text.primary' }}>
                    Description
                  </Typography>
                  <textarea
                    placeholder="e.g., Portfolio containing office buildings in Johannesburg CBD"
                    value={newPortfolioData.description}
                    onChange={(e) => handleUpdateNewPortfolioField('description', e.target.value)}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '6px',
                      border: `1.5px solid ${theme.palette.divider}`,
                      fontFamily: 'inherit',
                      fontSize: '0.95rem',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1, color: 'text.primary' }}>
                    Status
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={newPortfolioData.status || 'active'}
                      onChange={(e) => handleUpdateNewPortfolioField('status', e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.12)}` }}>
              <Button 
                onClick={() => setNewPortfolioOpen(false)} 
                variant="outlined"
                sx={{ textTransform: 'none', fontWeight: 700 }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateNewPortfolio} 
                variant="contained"
                disabled={!newPortfolioData.name || !newPortfolioData.clientId}
                sx={{ textTransform: 'none', fontWeight: 700 }}
              >
                Create Portfolio
              </Button>
            </DialogActions>
          </Dialog>

          {/* Portfolio Details Dialog */}
          <Dialog 
            open={portfolioDetailsOpen} 
            onClose={() => setPortfolioDetailsOpen(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}`
              }
            }}
          >
            <DialogTitle sx={{ 
              p: 3, 
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Business sx={{ mr: 2, color: theme.palette.primary.main }} />
                  <Box>
                    <Typography variant="h6" fontWeight={900}>
                      {isEditingPortfolio ? 'Edit Portfolio' : 'Portfolio Details'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedPortfolio?.name || 'Unknown Portfolio'}
                    </Typography>
                  </Box>
                </Box>
                <IconButton onClick={() => setPortfolioDetailsOpen(false)}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
              {selectedPortfolio && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Portfolio Name */}
                  <Box>
                    <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1, color: 'text.primary' }}>
                      Portfolio Name
                    </Typography>
                    {isEditingPortfolio ? (
                      <TextField
                        fullWidth
                        value={selectedPortfolio.name || ''}
                        onChange={(e) => handleUpdatePortfolioField('name', e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: theme.palette.primary.main,
                            },
                          }
                        }}
                      />
                    ) : (
                      <Typography variant="body1" sx={{ p: 2, bgcolor: alpha(theme.palette.grey[100], 0.5), borderRadius: 2 }}>
                        {selectedPortfolio.name || 'N/A'}
                      </Typography>
                    )}
                  </Box>

                  {/* Client Information */}
                  <Box>
                    <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1, color: 'text.primary' }}>
                      Client Information
                    </Typography>
                    <Box sx={{ p: 2, bgcolor: alpha(theme.palette.grey[100], 0.5), borderRadius: 2 }}>
                      <Typography variant="body1">
                        {selectedPortfolio.clientName || 'Unknown Client'}
                      </Typography>
                      {selectedPortfolio.clientEmail && (
                        <Typography variant="body2" color="text.secondary">
                          {selectedPortfolio.clientEmail}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Portfolio Status */}
                  <Box>
                    <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1, color: 'text.primary' }}>
                      Status
                    </Typography>
                    {isEditingPortfolio ? (
                      <FormControl fullWidth>
                        <Select
                          value={selectedPortfolio.status || 'active'}
                          onChange={(e) => handleUpdatePortfolioField('status', e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            }
                          }}
                        >
                          <MenuItem value="active">Active</MenuItem>
                          <MenuItem value="inactive">Inactive</MenuItem>
                          <MenuItem value="pending">Pending</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      <Chip 
                        label={selectedPortfolio.status === 'active' ? 'Active' : selectedPortfolio.status || 'Unknown'} 
                        size="small" 
                        color={selectedPortfolio.status === 'active' ? 'success' : 'default'}
                        variant="outlined"
                      />
                    )}
                  </Box>

                  {/* Description */}
                  <Box>
                    <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1, color: 'text.primary' }}>
                      Description
                    </Typography>
                    {isEditingPortfolio ? (
                      <textarea
                        value={selectedPortfolio.description || ''}
                        onChange={(e) => handleUpdatePortfolioField('description', e.target.value)}
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '6px',
                          border: `1.5px solid ${theme.palette.divider}`,
                          fontFamily: 'inherit',
                          fontSize: '0.95rem',
                          boxSizing: 'border-box',
                          resize: 'vertical',
                        }}
                      />
                    ) : (
                      <Typography variant="body1" sx={{ p: 2, bgcolor: alpha(theme.palette.grey[100], 0.5), borderRadius: 2, minHeight: 60 }}>
                        {selectedPortfolio.description || 'No description provided'}
                      </Typography>
                    )}
                  </Box>

                  {/* Assets Summary */}
                  <Box>
                    <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1, color: 'text.primary' }}>
                      Assets Summary
                    </Typography>
                    <Box sx={{ p: 2, bgcolor: alpha(theme.palette.grey[100], 0.5), borderRadius: 2 }}>
                      <Typography variant="body1">
                        Total Assets: {selectedPortfolio.assets?.length || selectedPortfolio.asset_count || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last updated: {new Date(selectedPortfolio.created_at || Date.now()).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </DialogContent>

            <DialogActions sx={{ p: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.12)}` }}>
              {!isEditingPortfolio ? (
                <>
                  <Button 
                    onClick={() => setPortfolioDetailsOpen(false)} 
                    variant="outlined"
                    sx={{ textTransform: 'none', fontWeight: 700 }}
                  >
                    Close
                  </Button>
                  <Button 
                    onClick={handleEditPortfolio} 
                    variant="contained"
                    sx={{ textTransform: 'none', fontWeight: 700 }}
                  >
                    Edit Portfolio
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => {
                      setIsEditingPortfolio(false)
                      // Reset to original values (in real app, you'd fetch fresh data)
                    }} 
                    variant="outlined"
                    sx={{ textTransform: 'none', fontWeight: 700 }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSavePortfolio} 
                    variant="contained"
                    sx={{ textTransform: 'none', fontWeight: 700 }}
                  >
                    Save Changes
                  </Button>
                </>
              )}
            </DialogActions>
          </Dialog>
        </Box>
        {/* End of Main Content with Sidebar */}
      </Box>
    </>
  )
}

export default AdminDashboard
