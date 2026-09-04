'use client';

import React from 'react';

interface AiMarkdownProps {
  content: string;
}

export function AiMarkdown({ content }: AiMarkdownProps) {
  // Simple, robust line-by-line markdown parser for clean Vedic AI rendering
  const lines = content.split('\n');

  return (
    <div className="space-y-2 text-sm leading-relaxed text-neutral-800">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Headings
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-serif text-base font-bold text-orange-950 mt-3 mb-1 border-b border-orange-200/60 pb-1">
              {renderFormattedText(trimmed.replace('### ', ''))}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="font-serif text-lg font-bold text-orange-950 mt-4 mb-1">
              {renderFormattedText(trimmed.replace('## ', ''))}
            </h3>
          );
        }

        // Bullet lists
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-orange-500 font-bold leading-5">•</span>
              <div className="flex-1">{renderFormattedText(trimmed.substring(2))}</div>
            </div>
          );
        }

        // Numbered lists
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="font-semibold text-orange-600 text-xs mt-0.5 min-w-4">{numMatch[1]}.</span>
              <div className="flex-1">{renderFormattedText(numMatch[2])}</div>
            </div>
          );
        }

        // Regular paragraphs
        return (
          <p key={idx} className="leading-relaxed">
            {renderFormattedText(line)}
          </p>
        );
      })}
    </div>
  );
}

function renderFormattedText(text: string): React.ReactNode[] {
  // Split by bold (**bold**) and inline code (`code`)
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-neutral-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="rounded bg-orange-100/70 px-1.5 py-0.5 text-xs font-mono text-orange-900">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
