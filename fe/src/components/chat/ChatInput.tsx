export default function ChatInput({ 
  value, 
  onChange, 
  onSubmit, 
  onFileSelect 
}: { 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  onSubmit: (e: React.FormEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <form className="flex gap-2 mx-2 pt-2" onSubmit={onSubmit}>
      <input
        value={value}
        onChange={onChange}
        type="text"
        placeholder="Type your message here"
        className="bg-white rounded-sm flex-grow border p-2"
      />
      <label className="bg-blue-200 border p-2 text-gray-700 rounded-sm cursor-pointer">
        <input
          type="file"
          className="hidden"
          onChange={onFileSelect}
        />
        Upload
      </label>
      <button type="submit" className="bg-blue-500 p-2 text-white rounded-sm">
        Send
      </button>
    </form>
  );
}
