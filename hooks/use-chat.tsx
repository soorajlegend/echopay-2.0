import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { toast } from "sonner";
import { Chat } from "@/types";



interface ChatItem {
  chats: Chat[];
  addChat: (data: Chat) => void;
  removeChat: (id: string) => void;
  clearAll: () => void;
}

const useChat = create(
  persist<ChatItem>(
    (set, get) => ({
      chats: [],
      addChat: (item: Chat) => {
        if (item.content.length === 0) return
        const chats = get().chats;
        set(() => ({
          chats: [...chats, item],
        }));
      },
      removeChat: (id: string) => {
        const chats = get().chats;
        const filteredChats = chats.filter(
          (item: Chat) => item.id !== id
        );
        set({ chats: filteredChats });
        toast.success("Chat deleted successfully");
      },
      clearAll: () => {
        set({
          chats: [],
        });
      },
    }),
    {
      name: "fintech-gpt-chats-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useChat;
