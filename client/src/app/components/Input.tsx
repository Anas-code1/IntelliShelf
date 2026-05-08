import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm text-foreground">
          {label}
        </label>
      )}
      <input
        className={`w-full h-10 px-3 rounded-lg border border-input bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all ${
          error ? 'border-destructive focus:ring-destructive' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm text-foreground">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-3 py-2 rounded-lg border border-input bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none ${
          error ? 'border-destructive focus:ring-destructive' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, error, className = '', children, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm text-foreground">
          {label}
        </label>
      )}
      <select
        className={`w-full h-10 px-3 rounded-lg border border-input bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all ${
          error ? 'border-destructive focus:ring-destructive' : ''
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
};
