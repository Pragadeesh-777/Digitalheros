'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Trash2,
  Bookmark,
  Users,
  CreditCard,
  Plus,
  Minus,
  Download,
  AlertCircle
} from 'lucide-react';
import { calculateExpenseSplit } from '../lib/ai-engine';
import { ExpenseSplitReport, Friend } from '../types';

interface ExpenseSplitterProps {
  onAddActivity: (title: string, desc: string, type: any) => void;
  onSaveNote: (title: string, content: string, category: any) => void;
  showToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function ExpenseSplitter({ onAddActivity, onSaveNote, showToast }: ExpenseSplitterProps) {
  const [friends, setFriends] = useState<Friend[]>([
    { id: 'f-1', name: 'Pragadeesh', paidAmount: 1200 },
    { id: 'f-2', name: 'Abhi', paidAmount: 300 },
    { id: 'f-3', name: 'Karthik', paidAmount: 0 }
  ]);
  const [report, setReport] = useState<ExpenseSplitReport | null>(null);
  
  // Update calculations automatically whenever friends data changes
  useEffect(() => {
    if (friends.length > 0) {
      const res = calculateExpenseSplit(friends);
      setReport(res);
    } else {
      setReport(null);
    }
  }, [friends]);

  const handleAddFriend = () => {
    if (friends.length >= 15) {
      showToast('Maximum 15 friends allowed in the splitter.', 'error');
      return;
    }
    const newId = `f-${Date.now()}`;
    const names = ['Dinesh', 'Suriya', 'Ramesh', 'Harish', 'Vijay'];
    const randomName = `${names[Math.floor(Math.random() * names.length)]} ${friends.length + 1}`;

    setFriends([
      ...friends,
      { id: newId, name: randomName, paidAmount: 0 }
    ]);
    showToast('New friend added.', 'success');
  };

  const handleRemoveFriend = (id: string) => {
    if (friends.length <= 2) {
      showToast('Minimum 2 people required to split expenses.', 'error');
      return;
    }
    setFriends(friends.filter(f => f.id !== id));
    showToast('Friend removed.', 'info');
  };

  const handleFriendChange = (id: string, field: 'name' | 'paidAmount', val: any) => {
    setFriends(friends.map(f => {
      if (f.id === id) {
        if (field === 'paidAmount') {
          const amt = parseFloat(val);
          return { ...f, paidAmount: isNaN(amt) ? 0 : amt };
        }
        return { ...f, name: val };
      }
      return f;
    }));
  };

  const handleSaveReport = () => {
    if (!report) return;

    let noteContent = `### Expense Split Ledger Report\n\n`;
    noteContent += `- **Total Shared Bill:** ₹${report.totalAmount}\n`;
    noteContent += `- **Individual Share:** ₹${report.sharePerPerson}\n\n`;
    
    noteContent += `**Individual Payments:**\n`;
    friends.forEach(f => {
      noteContent += `- ${f.name} paid: ₹${f.paidAmount}\n`;
    });
    
    noteContent += `\n**Settlement Instructions:**\n`;
    if (report.settlements.length === 0) {
      noteContent += `All expenses are fully settled! No payments required.\n`;
    } else {
      report.settlements.forEach(s => {
        noteContent += `- **${s.from}** pays **₹${s.amount}** to **${s.to}**\n`;
      });
    }

    onSaveNote('Expense Split Report', noteContent, 'expense');
    showToast('Report notes saved to Export Center!', 'success');
    onAddActivity(
      'Expense Report Saved', 
      `Logged total split of ₹${report.totalAmount} across ${friends.length} members`, 
      'expense'
    );
  };

  const handleDownload = () => {
    if (!report) return;

    let content = 
      `EXPENSE SPLIT REPORT\n` +
      `====================\n` +
      `Total Spent: ₹${report.totalAmount}\n` +
      `Share Per Person: ₹${report.sharePerPerson}\n\n` +
      `CONTRIBUTIONS:\n`;
      
    friends.forEach(f => {
      content += `- ${f.name}: paid ₹${f.paidAmount} (Net balance: ₹${(f.paidAmount - report.sharePerPerson).toFixed(2)})\n`;
    });

    content += `\nSETTLEMENT INSTRUCTIONS:\n`;
    if (report.settlements.length === 0) {
      content += `All expenses are settled. No transfers required.\n`;
    } else {
      report.settlements.forEach(s => {
        content += `- ${s.from} owes ₹${s.amount} to ${s.to}\n`;
      });
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense_split_report_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Report downloaded successfully!', 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-500">
          <CreditCard className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-heading">Placement Group Expense Splitter</h2>
          <p className="text-xs text-muted-foreground">Keep tabs on shared study resources, project hosting costs, or road trip balances.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        
        {/* Ledger panel */}
        <div className="space-y-5 rounded-xl glass-panel p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-bold font-heading flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-500" /> Share Ledger Group
            </h3>
            <button
              onClick={handleAddFriend}
              className="inline-flex items-center gap-1 bg-teal-600/10 hover:bg-teal-600/20 text-teal-400 text-xs px-2.5 py-1.5 rounded-lg font-semibold border border-teal-500/10 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add Person
            </button>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {friends.map((friend) => (
              <div key={friend.id} className="flex items-center gap-3 bg-white/5 border border-card-border p-3 rounded-xl transition-all">
                <input
                  type="text"
                  value={friend.name}
                  onChange={(e) => handleFriendChange(friend.id, 'name', e.target.value)}
                  placeholder="Person Name"
                  className="flex-1 min-w-0 bg-transparent border-0 border-b border-transparent focus:border-teal-500 outline-none text-xs font-semibold text-foreground/90 py-0.5 transition-all"
                />

                <div className="relative w-28 shrink-0">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-semibold">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={friend.paidAmount || ''}
                    onChange={(e) => handleFriendChange(friend.id, 'paidAmount', e.target.value)}
                    placeholder="0"
                    className="w-full bg-white/5 border border-card-border rounded-lg pl-6 pr-2.5 py-1.5 text-xs outline-none focus:border-teal-500 transition-all text-right font-mono"
                  />
                </div>

                <button
                  onClick={() => handleRemoveFriend(friend.id)}
                  className="p-1.5 rounded bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/10 transition-all shrink-0"
                  title="Remove Person"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Calculations panel */}
        {report ? (
          <div className="space-y-6">
            
            {/* Split Metrics Banner */}
            <div className="grid grid-cols-2 gap-4">
              
              <div className="p-4 rounded-xl glass-panel text-center sm:text-left space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Total Expenses</span>
                <h3 className="text-2xl font-bold font-heading text-teal-400">₹{report.totalAmount}</h3>
              </div>

              <div className="p-4 rounded-xl glass-panel text-center sm:text-left space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Individual Share</span>
                <h3 className="text-2xl font-bold font-heading text-purple-400">₹{report.sharePerPerson}</h3>
              </div>

            </div>

            {/* Settlements Instructions */}
            <div className="p-5 rounded-xl glass-panel space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">Debt Settlements Plan</h4>
              
              {report.settlements.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 opacity-60" />
                  <p className="font-semibold text-foreground/90">Balances are fully settled!</p>
                  <p className="text-[10px]">Adjust individual payment numbers to see settlement directions.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {report.settlements.map((s, idx) => (
                    <div key={idx} className="p-3 bg-white/5 border border-card-border rounded-xl text-xs flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-red-400">{s.from}</span>
                        <span className="text-muted-foreground text-[10px]">owes</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-teal-400">₹{s.amount}</span>
                        <span className="text-muted-foreground text-[10px]">to</span>
                        <span className="font-semibold text-purple-400">{s.to}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommendations warning */}
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 text-xs text-muted-foreground flex gap-2.5 items-start">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Settlements are calculated using a greedy transaction minimizer algorithm. Ensure balances are paid directly using your preferred payment services.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleSaveReport}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-foreground border border-card-border font-semibold text-xs px-3 py-2.5 rounded-lg transition-all"
              >
                <Bookmark className="w-3.5 h-3.5" /> Save Analysis
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-teal-600/15 hover:bg-teal-600/25 text-teal-400 font-semibold text-xs px-3 py-2.5 rounded-lg transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Download Report
              </button>
            </div>

          </div>
        ) : (
          /* Empty state */
          <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 rounded-xl glass-panel border-dashed border-card-border">
            <Users className="w-12 h-12 text-muted-foreground/45 mb-4 animate-pulse" />
            <h3 className="font-semibold text-sm">No expenses calculated</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">Add group members on the left to compute bill divisions.</p>
          </div>
        )}

      </div>

    </div>
  );
}
