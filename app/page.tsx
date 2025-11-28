import { Chat } from '@/components/chat';

export default function Home() {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Chat
        </h1>
      </header>

      {/* Chat */}
      <div className="flex-1 overflow-hidden">
        <Chat />
      </div>
    </div>
  );
}
