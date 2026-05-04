import React, { useRef, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AgentProcessProps {
  logs: string[];
}

export const AgentProcess: React.FC<AgentProcessProps> = ({ logs }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-card border border-zinc-800 rounded-3xl p-6 h-full flex flex-col">
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
  );
};
