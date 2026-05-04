import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, BookOpen, Layers, Terminal, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

interface Log {
  type: 'log' | 'report';
  content: string;
}

export default function App() {
  const [topic, setTopic] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [report, setReport] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleResearch = async () => {
    if (!topic) return;
    setLogs([]);
    setReport('');
    setIsResearching(true);

    try {
      const response = await fetch('http://localhost:8000/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      if (!response.body) return;
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (dataStr === '[DONE]') break;
            try {
              const data = JSON.parse(dataStr);
              if (data.type === 'log') {
                setLogs(prev => [...prev, data.content]);
              } else if (data.type === 'report') {
                setReport(data.content);
              }
            } catch (e) {
              console.error("Error parsing JSON", e);
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setLogs(prev => [...prev, "Error: Failed to connect to backend."]);
    } finally {
      setIsResearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col p-8 lg:p-16">
      {/* Header */}
      <div className="max-w-6xl mx-auto w-full mb-12 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold mb-4 tracking-tight"
        >
          InsightEngine
        </motion.h1>
        <p className="text-zinc-500 text-lg">Autonomous Multi-Agent Research Orchestrator</p>
      </div>

      {/* Search Section */}
      <div className="max-w-3xl mx-auto w-full mb-12">
        <div className="relative group">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
            placeholder="Enter a research topic (e.g., Future of Fusion Energy)"
            className="w-full bg-card border border-zinc-800 rounded-2xl py-4 pl-12 pr-32 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-lg"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
          <button
            onClick={handleResearch}
            disabled={isResearching}
            className="absolute right-2 top-2 bottom-2 bg-primary text-white px-6 rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isResearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Research"}
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* Left Panel: Agent Thoughts */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-card border border-zinc-800 rounded-3xl p-6 flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-zinc-400 font-medium">
              <Terminal className="w-4 h-4" />
              Agent Thinking Process
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
              <AnimatePresence>
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3 text-sm"
                  >
                    <div className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
                    <p className="text-zinc-300">{log}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={logEndRef} />
            </div>
          </div>
        </div>

        {/* Right Panel: Report Viewer */}
        <div className="lg:col-span-8">
          <div className="bg-card border border-zinc-800 rounded-3xl p-8 min-h-[600px] prose prose-invert max-w-none">
            {!report && !isResearching && (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600 opacity-50 space-y-4 py-32">
                <BookOpen className="w-12 h-12" />
                <p className="text-xl">Waiting for research to begin...</p>
              </div>
            )}
            {isResearching && !report && (
              <div className="h-full flex flex-col items-center justify-center text-primary space-y-4 py-32">
                <Loader2 className="w-12 h-12 animate-spin" />
                <p className="text-xl animate-pulse">Orchestrating agents...</p>
              </div>
            )}
            {report && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <ReactMarkdown>{report}</ReactMarkdown>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
