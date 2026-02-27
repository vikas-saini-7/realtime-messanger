export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: number;
  updatedAt?: number;
  isDeleted: boolean;
  isOwn?: boolean;
}

export interface Conversation {
  _id: string;
  isGroup: boolean;
  name?: string;
  createdAt: number;
  lastMessage?: string;
  lastMessageAt?: number;
  image: string;
  unreadCount: number;
}

export interface ConversationItemProps {
  conversation: Conversation;
}

export interface MessageItemProps {
  message: Message;
}

export interface MessageListProps {
  conversationId: string;
}

export interface MessageInputProps {
  conversationId: string;
}
