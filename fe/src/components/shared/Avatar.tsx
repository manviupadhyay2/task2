export default function Avatar({ username, online }: { username: string; online: boolean }) {
    return (
      <div className="relative">
        <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
          <span className="uppercase">{username[0]}</span>
        </div>
        {online && (
          <div className="absolute w-3 h-3 bg-green-500 rounded-full bottom-0 right-0 border-2 border-white"></div>
        )}
      </div>
    );
  }
  