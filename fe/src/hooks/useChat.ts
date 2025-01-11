import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';

import { SEND_MESSAGE } from '@/graphql/mutations/messages';
import { MESSAGE_SUBSCRIPTION } from '@/graphql/subscriptions/messages';
import { Message } from '@/types/chat';
import { uniqBy } from 'lodash';
import { GET_MESSAGES } from '@/graphql/queries/message';

export function useChat(recipientId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);

  const { data: messagesData, loading: messagesLoading, refetch } = useQuery(GET_MESSAGES, {
    variables: { recipientId },
    skip: !recipientId,
  });

  const [sendMessage] = useMutation(SEND_MESSAGE);

  const { data: newMessageData } = useSubscription(MESSAGE_SUBSCRIPTION, {
    variables: { recipientId },
    skip: !recipientId,
  });

  useEffect(() => {
    if (messagesData?.messages) {
      setMessages(messagesData.messages);
    }
  }, [messagesData]);

  useEffect(() => {
    if (newMessageData?.messageReceived) {
      setMessages(prev => uniqBy([...prev, newMessageData.messageReceived], 'id'));
    }
  }, [newMessageData]);

  const sendMessageHandler = useCallback(async (text: string, file?: File) => {
    if (!recipientId || (!text.trim() && !file)) return;

    try {
      await sendMessage({
        variables: {
          recipientId,
          text,
          file,
        },
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [recipientId, sendMessage]);

  return {
    messages,
    sendMessage: sendMessageHandler,
    loading: messagesLoading,
    refetchMessages: refetch,
  };
}