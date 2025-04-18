import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './routes/Home'
import Dashboard from './routes/Dashboard'
import Generator from './routes/Generator'
import LoginPage from './routes/Login'
import SignupPage from './routes/SignUp'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Profile from './routes/Profile'
const Layout = ({ children }) => {
  const location = useLocation()
  const isGeneratorPage = location.pathname === '/generator'

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {!isGeneratorPage && <Navbar />}
      <main>
        {children}
      </main>
      {!isGeneratorPage && <Footer />}
    </div>
  )
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/generator" element={
              <ProtectedRoute>
                <Generator />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  )
}

export default App
