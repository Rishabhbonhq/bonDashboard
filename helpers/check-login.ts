import axios from "axios"
import apiClient from "./axiosRequest"

const checkLogin = async () => {
    try{
        let response = await apiClient.get("/v1/auth/check-login-admin")

        if(response.status==200)
            return true
        else
            return false
    }catch(err){
        return false
    }
}

export default checkLogin