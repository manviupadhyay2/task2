import { useQuery } from '@apollo/client';
import { GET_USERS } from '@/graphql/queries/users';
import { User } from '@/types/chat';
import { useAuth } from './useAuth';

export function useUsers() {
  const { id: currentUserId } = useAuth();
  const { data, loading, error } = useQuery(GET_USERS);

  const users = data?.users || [];
  const onlineUsers = users.filter((user: User) => user.isOnline && user.id !== currentUserId);
  const offlineUsers = users.filter((user: User) => !user.isOnline && user.id !== currentUserId);

  return {
    onlineUsers,
    offlineUsers,
    loading,
    error,
  };
}