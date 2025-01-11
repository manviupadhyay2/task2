import { Message } from '@/types/chat';

export default function MessageList({ 
  messages, 
  currentUserId 
}: { 
  messages: Message[]; 
  currentUserId: string;
}) {
  return (
    <div className="flex-grow overflow-y-auto">
      {messages.map((msg) => (
        <div key={msg.id} className={msg.sender === currentUserId ? "text-right" : "text-left"}>
          <div
            className={`inline-block text-left max-w-[70%] p-2 my-2 rounded-md ${
              msg.sender === currentUserId ? "bg-blue-500 text-white" : "bg-white text-gray-500"
            }`}
            style={{ wordWrap: "break-word" }}
          >
            {msg.text}
            {msg.file && (
              <div>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 border-b"
                  href={`http://localhost:5003/uploads/${msg.file}`}
                >
                  {msg.file}
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}