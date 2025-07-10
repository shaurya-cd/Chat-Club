import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =  "http://localhost:8000" 

export const useAuthStore = create((set,get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIng: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    onlineUsers: [],
    socket: null,

    checkAuth: async()=>{
        try {
            const res = await axiosInstance.get("/user/check")
            set({authUser: res.data})

            get().connectSocket();
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

            get().connectSocket();
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

            get().disconnectSocket()
        } catch (error) {
            toast.error("Failed to Logout")
        }
    },

    updateProfile:async(img)=>{
        try {
            set({isUpdatingProfile:true})
            const res = await axiosInstance.put("/user/update",img)
            set({authUser:res.data})
            toast.success("Profile Updated successfully")
        } catch (error) {
            toast.error("Failed to Update Profile")
        } finally {
            set({isUpdatingProfile:false})
        }
    },

    connectSocket:()=>{
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });
        socket.connect();

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    disconnectSocket:()=>{
        if (get().socket?.connected) get().socket.disconnect();
    }
}))