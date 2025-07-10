import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";


export const useChatStore = create((set,get)=>({
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

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/msg/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error("Cannot send Message");
        } 
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
        const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
        if (!isMessageSentFromSelectedUser) return;

        set({
            messages: [...get().messages, newMessage],
        });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}))