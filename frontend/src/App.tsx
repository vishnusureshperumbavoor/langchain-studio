import { useState } from 'react';
import { motion } from 'framer-motion';
import { SearchInput } from './components/SearchInput';
import { AgentProcess } from './components/AgentProcess';
import { ReportViewer } from './components/ReportViewer';

export default function App() {
  const [topic, setTopic] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [report, setReport] = useState('');
  const [isResearching, setIsResearching] = useState(false);

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

      <SearchInput 
        topic={topic} 
        setTopic={setTopic} 
        onSearch={handleResearch} 
        isResearching={isResearching} 
      />

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        <div className="lg:col-span-4 min-h-[400px]">
          <AgentProcess logs={logs} />
        </div>

        <div className="lg:col-span-8">
          <ReportViewer report={report} isResearching={isResearching} />
        </div>
      </div>
    </div>
  );
}
