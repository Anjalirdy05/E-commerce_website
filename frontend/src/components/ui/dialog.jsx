import React from "react";

export const Dialog = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 w-96">
        <button
          className="text-gray-500 text-sm float-right"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export const DialogContent = ({ children }) => (
  <div className="p-2">{children}</div>
);

export const DialogHeader = ({ children }) => (
  <div className="font-semibold text-lg mb-2">{children}</div>
);

export const DialogTitle = ({ children }) => (
  <div className="text-gray-700">{children}</div>
);
