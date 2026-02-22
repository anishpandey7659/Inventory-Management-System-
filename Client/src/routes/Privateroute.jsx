import { useContext} from 'react'
import { AuthContext } from '../context/Authprovider'
import { Navigate } from 'react-router-dom'


const Privateroute = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  return token ? children : <Navigate to="/" />;
};

export default Privateroute;
