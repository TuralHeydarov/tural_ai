import { Chat } from '@/components/chat';

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Tural.AI
        </h1>
      </header>

      {/* Chat */}
      <main className="flex-1 overflow-hidden">
        <Chat />
      </main>
    </div>
  );
}
