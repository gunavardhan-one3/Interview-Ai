import {useContext,useEffect} from "react";
import {AuthContext} from "../auth.context.jsx";
import { login, register, logout, getMe} from "../services/auth.api";


export const useAuth=()=>{

    const context=useContext(AuthContext);
    const {user,setUser,loading,setLoading}=context;


    const handleLogin = async({email,password})=>{
        setLoading(true);
        try{
            const data = await login({email,password});
            setUser(data.user);

        }catch(error){ 
            console.log("Login error:", error);
        }
        finally{
            setLoading(false);
        }
    }

    const handleRegister = async({name,email,password})=>{
        setLoading(true);
        try{

            const data = await register({username,email,password});
            setUser(data.user);
        }catch(error){
            console.log("Registration error:", error);
        }finally{
        setLoading(false);
    }
}
    
    const handleLogout = async()=>{
        setLoading(true);
        try{

            const data = await logout();
            setUser(null);
        }catch(error){
            console.log("Logout error:", error);
        }finally{
        setLoading(false);
    }
}


    useEffect(() => {
    const getAndSetUser = async () => {
        try {
            const data = await getMe();
            setUser(data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    getAndSetUser();
}, []);



    return { user,loading,handleRegister,handleLogin,handleLogout}
}