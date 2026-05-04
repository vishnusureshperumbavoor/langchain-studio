import React from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchInputProps {
  topic: string;
  setTopic: (value: string) => void;
  onSearch: () => void;
  isResearching: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({ topic, setTopic, onSearch, isResearching }) => {
  return (
    <div className="max-w-3xl mx-auto w-full mb-12">
      <div className="relative group">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          placeholder="Enter a research topic (e.g., Future of Fusion Energy)"
          className="w-full bg-card border border-zinc-800 rounded-2xl py-4 pl-12 pr-32 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-lg"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
        <button
          onClick={onSearch}
          disabled={isResearching}
          className="absolute right-2 top-2 bottom-2 bg-primary text-white px-6 rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isResearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Research"}
        </button>
      </div>
    </div>
  );
};
