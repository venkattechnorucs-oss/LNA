import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  GraduationCap,
  Clock,
  MessageSquare
} from 'lucide-react';
import { LNAChatMessage } from '../types';

interface CircleDPProps {
  name: string;
  role: 'employee' | 'manager' | 'system';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  className?: string;
}

export const CircleDP: React.FC<CircleDPProps> = ({
  name,
  role,
  size = 'sm',
  showBadge = true,
  className = ''
}) => {
  // Extract clean 2-letter initials
  const initials = React.useMemo(() => {
    if (!name || name.trim().length === 0) {
      return role === 'manager' ? 'MG' : 'EP';
    }
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [name, role]);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  }[size];

  const badgeSizeClasses = {
    xs: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5',
    sm: 'w-3 h-3 -bottom-0.5 -right-0.5',
    md: 'w-4 h-4 -bottom-1 -right-1',
    lg: 'w-4.5 h-4.5 -bottom-1 -right-1'
  }[size];

  const isManager = role === 'manager';

  return (
    <div className={`relative shrink-0 select-none ${className}`}>
      {/* Circle Profile Picture Avatar */}
      <div
        className={`${sizeClasses} rounded-full flex items-center justify-center font-bold text-white shadow-xs transition-transform transform ${
          isManager
            ? 'bg-gradient-to-br from-[#1a5075] via-[#0275a8] to-[#084166] ring-2 ring-[#0275a8]/30 border-2 border-white'
            : 'bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 ring-2 ring-emerald-400/30 border-2 border-white'
        }`}
        title={`${name} (${isManager ? 'Manager' : 'Employee'})`}
      >
        <span>{initials}</span>
      </div>

      {/* Role Indicator Mini-Badge on Circle DP */}
      {showBadge && (
        <div
          className={`absolute ${badgeSizeClasses} rounded-full flex items-center justify-center border border-white shadow-xs ${
            isManager ? 'bg-[#0275a8] text-white' : 'bg-emerald-600 text-white'
          }`}
          title={isManager ? 'Verified Manager' : 'Employee'}
        >
          {isManager ? (
            <ShieldCheck className="w-2.5 h-2.5" />
          ) : (
            <GraduationCap className="w-2.5 h-2.5" />
          )}
        </div>
      )}
    </div>
  );
};

interface LnaChatboxProps {
  messages: LNAChatMessage[];
  onSendMessage?: (text: string, role?: 'employee' | 'manager') => void;
  currentUserRole: 'employee' | 'manager';
  currentUserName: string;
  reportingManagerName: string;
  employeeName: string;
  isReadOnly?: boolean;
  value?: string;
  onChangeText?: (val: string) => void;
}

export const LnaChatbox: React.FC<LnaChatboxProps> = ({
  messages = [],
  onSendMessage,
  currentUserRole: initialRole,
  currentUserName: _currentUserName,
  reportingManagerName: _reportingManagerName,
  employeeName: _employeeName,
  isReadOnly = false,
  value,
  onChangeText
}) => {
  const [inputText, setInputText] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(messages.length);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : inputText;

  const handleTextChange = (newVal: string) => {
    if (onChangeText) {
      onChangeText(newVal);
    }
    if (!isControlled) {
      setInputText(newVal);
    }
  };

  useEffect(() => {
    // Only scroll within the chat container itself if a new message was added
    if (messages.length > prevCountRef.current && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
    prevCountRef.current = messages.length;
  }, [messages.length]);

  return (
    <div className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(26,80,117,0.05)] overflow-hidden flex flex-col">
      {/* Chatbox Header - Clean Comment History Title */}
      <div className="bg-gradient-to-r from-[#1a5075] via-[#154668] to-[#0275a8] text-white px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/15 text-white flex items-center justify-center border border-white/20">
            <MessageSquare className="w-4 h-4 text-sky-200" />
          </div>
          <h3 className="font-bold text-xs sm:text-sm tracking-wide">
            Comment History
          </h3>
        </div>
      </div>

      {/* Modern Chat Message Canvas with Circular DPs */}
      <div
        ref={chatContainerRef}
        className="p-4 sm:p-5 overflow-y-auto space-y-3.5 min-h-[160px] max-h-[320px] bg-[#f7f9fb]/70 backdrop-blur-xs relative"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(200, 215, 225, 0.25) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      >
        {messages.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            <p>No previous comment history for this cycle. Enter your development thoughts below and submit.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isManager = msg.sender === 'manager';

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  isManager ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Circle DP Picture next to the chat bubble */}
                <CircleDP
                  name={msg.senderName}
                  role={isManager ? 'manager' : 'employee'}
                  size="sm"
                  showBadge={true}
                  className="mt-0.5 shadow-xs"
                />

                {/* Chat Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-xs text-xs relative ${
                    isManager
                      ? 'bg-gradient-to-br from-[#eaf4fb] to-[#d8ecf8] text-slate-900 border border-[#b8dcfa] rounded-tr-xs'
                      : 'bg-gradient-to-br from-[#eafaf1] to-[#daf5e4] text-slate-900 border border-[#bbf7b8] rounded-tl-xs'
                  }`}
                >
                  {/* Sender Header with Name */}
                  <div className="flex items-center justify-between gap-3 mb-1 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-bold ${
                          isManager ? 'text-[#1a5075]' : 'text-emerald-950'
                        }`}
                      >
                        {msg.senderName}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-slate-400" />
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Message Body */}
                  <p className="whitespace-pre-wrap leading-relaxed break-words text-slate-800 text-[12px]">
                    {msg.text}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Separate Dedicated Comments / Development Thoughts Box */}
      <div className="p-4 sm:p-5 bg-white/95 border-t border-slate-200/90">
        <label htmlFor="lna-comment-input" className="block text-xs font-bold text-[#1a5075] uppercase tracking-wider mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <span>{initialRole === 'manager' ? 'Manager Review Remarks' : 'Development Thoughts'}</span>
            <span className="text-red-500 font-bold text-sm" title="Required">*</span>
          </span>
        </label>
        <div className="space-y-2">
          <textarea
            id="lna-comment-input"
            rows={3}
            value={currentValue}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={
              isReadOnly
                ? 'This discussion thread is finalized and development thoughts are locked.'
                : initialRole === 'manager'
                ? 'Enter manager review remarks or developmental feedback here...'
                : 'Enter your development thoughts, notes, or developmental remarks here...'
            }
            disabled={isReadOnly}
            className="w-full text-xs p-3 border border-slate-300 rounded-xl bg-slate-50/70 text-slate-900 focus:outline-hidden focus:border-[#0275a8] focus:bg-white focus:ring-2 focus:ring-[#0275a8]/20 placeholder:text-slate-400 disabled:bg-slate-100 disabled:text-slate-400 shadow-inner resize-y leading-relaxed font-normal"
          />
          {!isReadOnly && (
            <p className="text-[11px] text-slate-500">
              {initialRole === 'manager'
                ? 'Remarks entered here will be saved when you approve or return the assessment.'
                : 'Enter your development thoughts above and submit the form below.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
