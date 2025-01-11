import Avatar from '../shared/Avatar';

export default function ChatHeader({ username, online }: { username: string; online: boolean }) {
  return (
    <div className="w-full bg-white shadow-xs border rounded-md px-2 py-2 gap-2 flex items-center">
      <Avatar username={username} online={online} />
      <span className="text-gray-800 capitalize">{username}</span>
    </div>
  );
}