import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import SignUp from "../pages/SignUp";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIng: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    checkAuth: async()=>{
        try {
            const res = await axiosInstance.get("/user/check")
            set({authUser: res.data})
        } catch (error) {
            console.log("Error in CheckAuth",error)
            set({authUser: null})
        } finally {
            set({isCheckingAuth:false})
        }
    },

    signUp: async(data)=>{
        set({isSigningUp:true})
        try {
            const res = await axiosInstance.post("/user/signup",data)
            set({authUser: res.data})
            toast.success("Account created successfully")
        } catch (error) {
            toast.error("Failed to Register")
        } finally {
            set({isSigningUp:false})
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
        const res = await axiosInstance.post("/user/login", data);
        set({ authUser: res.data });
        toast.success("Logged in successfully");

        get().connectSocket();
        } catch (error) {
        toast.error("Failed to Login");
        } finally {
        set({ isLoggingIn: false });
        }
    },

    logout:async()=>{
        try {
            const res = await axiosInstance.post("/user/logout") 
            set({authUser: null})
            toast.success("Logged Out successfully")
        } catch (error) {
            toast.error("Failed to Logout")
        }
    }

}))