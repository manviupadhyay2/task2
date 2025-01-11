export interface User {
    id: string;
    username: string;
    isOnline: boolean;
    avatarUrl?: string;
    lastSeen?: Date;
  }
  
  export interface Message {
    id: string;
    sender: string;
    recipient: string;
    text: string;
    file?: string;
    createdAt: Date;
    read: boolean;
  }
  
  export interface Conversation {
    id: string;
    participants: User[];
    lastMessage?: Message;
    unreadCount: number;
  }