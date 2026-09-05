'use client';

import React from 'react';

interface AiMarkdownProps {
  content: string;
  darkMode?: boolean;
}

export function AiMarkdown({ content, darkMode = false }: AiMarkdownProps) {
  // Simple, robust line-by-line markdown parser for clean Vedic AI rendering
  const lines = content.split('\n');

  return (
    <div className={`space-y-2.5 text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-slate-100' : 'text-neutral-800'}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Headings
        if (trimmed.startsWith('### ')) {
          return (
            <h4
              key={idx}
              className={`font-serif text-sm sm:text-base font-black mt-3 mb-1 border-b pb-1 ${
                darkMode ? 'text-amber-300 border-amber-500/30' : 'text-orange-950 border-orange-200/60'
              }`}
            >
              {renderFormattedText(trimmed.replace('### ', ''), darkMode)}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3
              key={idx}
              className={`font-serif text-base sm:text-lg font-black mt-3.5 mb-1 ${
                darkMode ? 'text-amber-300' : 'text-orange-950'
              }`}
            >
              {renderFormattedText(trimmed.replace('## ', ''), darkMode)}
            </h3>
          );
        }

        // Bullet lists
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
          const bulletText = trimmed.startsWith('• ')
            ? trimmed.substring(2)
            : trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-2 pl-1.5">
              <span className={`font-bold leading-5 ${darkMode ? 'text-amber-400' : 'text-orange-500'}`}>•</span>
              <div className="flex-1">{renderFormattedText(bulletText, darkMode)}</div>
            </div>
          );
        }

        // Numbered lists
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1.5">
              <span className={`font-bold text-xs mt-0.5 min-w-4.5 ${darkMode ? 'text-amber-300' : 'text-orange-600'}`}>
                {numMatch[1]}.
              </span>
              <div className="flex-1">{renderFormattedText(numMatch[2], darkMode)}</div>
            </div>
          );
        }

        // Regular paragraphs
        return (
          <p key={idx} className="leading-relaxed">
            {renderFormattedText(line, darkMode)}
          </p>
        );
      })}
    </div>
  );
}

function renderFormattedText(text: string, darkMode = false): React.ReactNode[] {
  // Split by bold (**bold**) and inline code (`code`)
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className={`font-black ${darkMode ? 'text-amber-200' : 'text-neutral-900'}`}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className={`rounded px-1.5 py-0.5 text-xs font-mono ${
            darkMode ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30' : 'bg-orange-100/70 text-orange-900'
          }`}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
