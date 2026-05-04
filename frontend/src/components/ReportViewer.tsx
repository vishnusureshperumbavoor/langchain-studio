import React from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

interface ReportViewerProps {
  report: string;
  isResearching: boolean;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({ report, isResearching }) => {
  return (
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
  );
};
