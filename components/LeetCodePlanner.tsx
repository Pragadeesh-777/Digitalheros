'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Trash2,
  Bookmark,
  Calendar,
  CheckCircle2, 
  ListTodo,
  TrendingUp,
  Clock
} from 'lucide-react';
import { generateLeetCodePlan } from '../lib/ai-engine';
import { StudyTask } from '../types';

interface LeetCodePlannerProps {
  onAddActivity: (title: string, desc: string, type: any) => void;
  onSaveNote: (title: string, content: string, category: any) => void;
  showToast: (msg: string, type: 'success' | 'info' | 'error') => void;
  onUpdateStudyProgress: (pct: number) => void;
}

export default function LeetCodePlanner({ onAddActivity, onSaveNote, showToast, onUpdateStudyProgress }: LeetCodePlannerProps) {
  const [formData, setFormData] = useState({
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard' | 'Mixed',
    topics: ['Arrays', 'Linked Lists', 'Trees'] as string[],
    hoursAvailable: 3
  });
  
  const [planTasks, setPlanTasks] = useState<StudyTask[]>([]);
  const [isPending, setIsPending] = useState(false);

  // Available topics list
  const topicsList = ['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming'];

  // Load existing plan from local storage on mount
  useEffect(() => {
    const savedPlan = localStorage.getItem('leetcode_study_plan_tasks');
    if (savedPlan) {
      const parsed = JSON.parse(savedPlan);
      setPlanTasks(parsed);
      calculateAndNotifyProgress(parsed);
    }
  }, []);

  const handleTopicToggle = (topic: string) => {
    if (formData.topics.includes(topic)) {
      setFormData({
        ...formData,
        topics: formData.topics.filter(t => t !== topic)
      });
    } else {
      setFormData({
        ...formData,
        topics: [...formData.topics, topic]
      });
    }
  };

  const handleGenerate = () => {
    if (formData.topics.length === 0) {
      showToast('Please select at least one topic for your plan.', 'error');
      return;
    }

    setIsPending(true);
    setTimeout(() => {
      const tasks = generateLeetCodePlan(formData);
      setPlanTasks(tasks);
      localStorage.setItem('leetcode_study_plan_tasks', JSON.stringify(tasks));
      calculateAndNotifyProgress(tasks);
      setIsPending(false);
      showToast('30-Day Study Plan generated!', 'success');
      onAddActivity(
        'LeetCode Plan Generated', 
        `Built 30-day study plan targeting ${formData.difficulty} problems in ${formData.topics.join(', ')}`, 
        'leetcode'
      );
    }, 800);
  };

  const handleClear = () => {
    setFormData({ difficulty: 'Easy', topics: [], hoursAvailable: 2 });
    setPlanTasks([]);
    localStorage.removeItem('leetcode_study_plan_tasks');
    onUpdateStudyProgress(0);
    showToast('Plan reset successfully.', 'info');
  };

  const handleToggleTask = (taskId: string) => {
    const updated = planTasks.map(t => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    setPlanTasks(updated);
    localStorage.setItem('leetcode_study_plan_tasks', JSON.stringify(updated));
    calculateAndNotifyProgress(updated);
  };

  const calculateAndNotifyProgress = (tasks: StudyTask[]) => {
    if (tasks.length === 0) return;
    const completedCount = tasks.filter(t => t.completed).length;
    const pct = Math.round((completedCount / tasks.length) * 100);
    onUpdateStudyProgress(pct);
  };

  const handleSaveReport = () => {
    if (planTasks.length === 0) return;

    let noteContent = `### LeetCode 30-Day Study Planner\n\n`;
    planTasks.forEach(task => {
      const isChecked = task.completed ? ' [x] ' : ' [ ] ';
      noteContent += `**Day ${task.day}: ${task.problemName}** (${task.difficulty} | ${task.topic})\n`;
      noteContent += `- Status:${isChecked}Completed\n`;
      noteContent += `- Details: ${task.description}\n\n`;
    });

    onSaveNote('My LeetCode 30-Day Plan', noteContent, 'leetcode');
    showToast('Plan notes saved to Export Center!', 'success');
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10';
      case 'Medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/10';
      default: return 'bg-red-500/10 text-red-500 border-red-500/10';
    }
  };

  const completedCount = planTasks.filter(t => t.completed).length;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-500">
          <ListTodo className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-heading">LeetCode Study Planner</h2>
          <p className="text-xs text-muted-foreground">Formulate customized algorithmic study pathways for placements.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Left Form config */}
        <div className="space-y-5 rounded-xl glass-panel p-6">
          <h3 className="text-sm font-bold font-heading flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-500" /> Plan Setup
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80">Target Difficulty Level</label>
            <div className="grid grid-cols-2 gap-2">
              {['Easy', 'Medium', 'Hard', 'Mixed'].map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setFormData({ ...formData, difficulty: diff as any })}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all ${formData.difficulty === diff ? 'bg-teal-600 text-white border-teal-600' : 'bg-white/5 border-card-border text-muted-foreground hover:text-foreground'}`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground/80">Filter Focus Topics (Select one or more)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {topicsList.map((topic) => {
                const isSelected = formData.topics.includes(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => handleTopicToggle(topic)}
                    className={`py-2 px-3 text-left text-xs font-semibold rounded-lg border flex items-center justify-between transition-all ${isSelected ? 'bg-purple-600/15 border-purple-500 text-purple-400' : 'bg-white/5 border-card-border text-muted-foreground hover:text-foreground'}`}
                  >
                    <span>{topic}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 font-sans">
            <div className="flex justify-between text-xs font-semibold text-foreground/80">
              <span>Workload Per Day</span>
              <span className="text-teal-500 font-bold">{formData.hoursAvailable} hours / day</span>
            </div>
            <input
              type="range"
              min="1"
              max="6"
              value={formData.hoursAvailable}
              onChange={(e) => setFormData({ ...formData, hoursAvailable: Number(e.target.value) })}
              className="w-full cursor-ew-resize"
            />
            <div className="flex justify-between text-[9px] text-muted-foreground">
              <span>Light (1h)</span>
              <span>Moderate (3h)</span>
              <span>Intensive (6h)</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleGenerate}
              disabled={isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow-lg hover:shadow-teal-500/20 disabled:opacity-50 transition-all duration-200"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating calendar...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Create Study Plan
                </>
              )}
            </button>
            <button
              onClick={handleClear}
              className="inline-flex items-center justify-center bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 text-foreground border border-card-border px-3 py-2.5 rounded-lg transition-all"
              title="Reset Plan"
            >
              <Trash2 className="w-4.5 h-4.5 text-red-400" />
            </button>
          </div>

        </div>

        {/* Right Output checklist */}
        <div className="xl:col-span-2 space-y-6">
          {planTasks.length > 0 ? (
            <div className="space-y-5">
              
              {/* Progress Summary Card */}
              <div className="p-5 rounded-xl glass-panel border border-card-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">30-Day Completion metrics</h4>
                  <p className="text-xs text-muted-foreground">
                    You completed <strong className="text-foreground">{completedCount}</strong> out of <strong className="text-foreground">{planTasks.length}</strong> algorithmic tasks.
                  </p>
                </div>
                
                <div className="flex items-center gap-4 shrink-0">
                  <div className="h-2 w-32 bg-white/5 dark:bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="bg-teal-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.round((completedCount / planTasks.length) * 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold font-heading">{Math.round((completedCount / planTasks.length) * 100)}%</span>
                  
                  <button
                    onClick={handleSaveReport}
                    className="inline-flex items-center justify-center bg-white/5 hover:bg-white/10 text-foreground border border-card-border text-xs px-2.5 py-1.5 rounded-lg transition-all"
                  >
                    <Bookmark className="w-3.5 h-3.5" /> Save Plan
                  </button>
                </div>
              </div>

              {/* Tasks List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
                {planTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`p-4 rounded-xl border transition-all flex gap-3.5 items-start ${task.completed ? 'bg-teal-500/5 border-teal-500/20 opacity-80' : 'glass-panel border-card-border hover:border-brand-500/20'}`}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.id)}
                      className="mt-1 accent-teal-600 rounded cursor-pointer shrink-0"
                    />

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 border-b border-card-border pb-1.5">
                        <span className="text-[10px] font-bold text-teal-400">Day {task.day}</span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wider ${getDifficultyBadge(task.difficulty)}`}>
                          {task.difficulty}
                        </span>
                      </div>
                      
                      <h4 className={`font-semibold text-xs text-foreground/95 truncate ${task.completed ? 'line-through text-muted-foreground/60' : ''}`}>
                        {task.problemName}
                      </h4>
                      
                      <p className={`text-[10px] text-muted-foreground leading-normal ${task.completed ? 'line-through text-muted-foreground/40' : ''}`}>
                        {task.description}
                      </p>

                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[9px] bg-purple-500/10 text-purple-400 font-semibold px-1.5 py-0.2 rounded">
                          {task.topic}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            /* Empty state */
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 rounded-xl glass-panel border-dashed border-card-border">
              <ListTodo className="w-12 h-12 text-muted-foreground/45 mb-4 animate-pulse" />
              <h3 className="font-semibold text-sm">No active LeetCode plan</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">Configure your desired topics on the left to set up a 30-day coding progress sheet.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
