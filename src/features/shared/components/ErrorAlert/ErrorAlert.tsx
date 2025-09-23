'use client';

interface ErrorAlertProps {
  message: string | null;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  if (!message) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <span className="text-red-500 mr-2">❌</span>
        <p className="text-red-700">{message}</p>
      </div>
    </div>
  );
}