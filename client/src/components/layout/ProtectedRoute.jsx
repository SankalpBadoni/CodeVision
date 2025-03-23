import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({children}) => {
    const {isLoggedIn} = useSelector((state) => state.auth)
    if(!isLoggedIn){
        return <Navigate to="/login" />
    }
    return children
}

export default ProtectedRoute
