"use client";

import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface KeywordsInputProps {
  value: string[];
  onChange: (keywords: string[]) => void;
  placeholder?: string;
}

export default function KeywordsInput({ value, onChange, placeholder = "Enter keywords..." }: KeywordsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const keyword = inputValue.trim();
      if (!value.includes(keyword)) {
        onChange([...value, keyword]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // Remove last keyword if input is empty and backspace is pressed
      onChange(value.slice(0, -1));
    }
  };

  const removeKeyword = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        {value.map((keyword, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
          >
            {keyword}
            <button
              type="button"
              onClick={() => removeKeyword(index)}
              className="hover:bg-blue-200 rounded-full p-0.5"
              aria-label={`Remove ${keyword}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] outline-none bg-transparent text-base"
        />
      </div>
      <p className="text-sm text-gray-500">
        Press Enter to add keywords. Use backspace to remove the last keyword.
      </p>
    </div>
  );
}
