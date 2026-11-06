import type { Gradient } from './user.types';

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  time: string;
  /** true when sent by the current user. */
  mine: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantInitials: string;
  gradient: Gradient;
  online: boolean;
  activity?: string;
  unread: number;
  messages: ChatMessage[];
}
