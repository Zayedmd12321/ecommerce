// File: app/components/MessageAlert.tsx
import { CheckCircle, AlertCircle } from 'lucide-react';
import styles from '@/app/admin/admin.module.css'; // Use admin styles for the alert

interface Message {
  type: 'success' | 'error';
  text: string;
}

interface MessageAlertProps {
  message: Message | null;
}

export default function MessageAlert({ message }: MessageAlertProps) {
  if (!message) return null;

  return (
    <div
      className={`${styles.message} ${
        message.type === 'success' ? styles.success : styles.error
      }`}
    >
      {message.type === 'success' ? (
        <CheckCircle size={20} />
      ) : (
        <AlertCircle size={20} />
      )}
      {message.text}
    </div>
  );
}