import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";


export const useChatStore = create((set)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUserLoading:false,
    isMessagesLoading:false,

    getUsers:async()=>{
        set({isUserLoading:true})
        try {
            const res = await axiosInstance.get("/msg/users")
            set({users:res.data})
        } catch (error) {
            toast.error("Failed to fetch user")
        } finally {
            set({isUserLoading:false})
        }
    },

    getMessages:async(userId)=>{
        set({isMessagesLoading:true})
        try {
            const res = await axiosInstance.get(`/msg/${userId}`)
            set({messages:res.data})
        } catch (error) {
            toast.error("Failed to fetch messages")
        } finally {
            set({isMessagesLoading:false})
        }
    },

    setSelectedUser:async(selectedUser)=>set({selectedUser})
}))