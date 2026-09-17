import React from 'react';
import { LNAChatMessage } from '../types';
import { LnaChatbox } from './LnaChatbox';

interface CommentsSectionProps {
  comments: string;
  onChangeComments: (val: string) => void;
  messages?: LNAChatMessage[];
  onSendMessage?: (text: string, role?: 'employee' | 'manager') => void;
  employeeName: string;
  reportingManagerName: string;
  isReadOnly?: boolean;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  onChangeComments,
  messages = [],
  onSendMessage,
  employeeName,
  reportingManagerName,
  isReadOnly = false
}) => {
  // If read-only and comments exist without message entry, show it in the message thread
  const effectiveMessages = React.useMemo(() => {
    const msgs: LNAChatMessage[] = messages && messages.length > 0 ? [...messages] : [];

    const hasEmployeeMsg = msgs.some((m) => m.sender === 'employee' || m.id === 'msg-emp-comment');
    if (isReadOnly && !hasEmployeeMsg && comments && comments.trim()) {
      msgs.unshift({
        id: 'msg-emp-comment',
        sender: 'employee' as const,
        senderName: employeeName,
        text: comments.trim(),
        timestamp: 'Today'
      });
    }

    return msgs;
  }, [messages, comments, employeeName, isReadOnly]);

  const handleSendMessage = (text: string, role?: 'employee' | 'manager') => {
    if (onSendMessage) {
      onSendMessage(text, role || 'employee');
    } else {
      onChangeComments(text);
    }
  };

  return (
    <section className="mb-6">
      <LnaChatbox
        messages={effectiveMessages}
        onSendMessage={handleSendMessage}
        currentUserRole="employee"
        currentUserName={employeeName}
        reportingManagerName={reportingManagerName}
        employeeName={employeeName}
        isReadOnly={isReadOnly}
        value={comments}
        onChangeText={onChangeComments}
      />
    </section>
  );
};
