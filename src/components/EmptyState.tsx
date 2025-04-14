import React, { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, message }) => {
  return (
    <div className="mt-4 py-12 text-center">
      <div className="mx-auto h-12 w-12 text-gray-400">{icon}</div>
      <p className="mt-2 text-gray-500">{message}</p>
    </div>
  );
};

export default EmptyState;
