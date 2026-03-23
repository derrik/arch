import { useState } from 'react';
import type { IconMeta } from '@/types/icon';

interface IconDetailProps {
  icon: IconMeta;
}

function sanitizeSvg(raw: string): string {
  return raw
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '');
}

export function IconDetail({ icon }: IconDetailProps) {
  const [showSource, setShowSource] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(icon.svgContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border-default)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: 16, borderBottom: '1px solid var(--border-default)' }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
          {icon.name}
        </h3>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
          {icon.source === 'workspace' ? `Workspace${icon.folder ? ` / ${icon.folder}` : ''}` : 'Library'}
        </div>
      </div>

      {/* Description */}
      {icon.description && (
        <div
          style={{
            padding: '0 16px',
            marginTop: 4,
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
              marginBottom: 4,
            }}
          >
            LLM Description
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              fontStyle: 'italic',
              padding: 10,
              background: 'var(--bg-primary)',
              borderRadius: 8,
              border: '1px solid var(--border-default)',
            }}
          >
            {icon.description}
          </div>
        </div>
      )}

      {/* Large Preview */}
      <div
        style={{
          padding: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '0 0 auto',
        }}
      >
        <div
          style={{
            width: 128,
            height: 128,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-primary)',
            borderRadius: 12,
            border: '1px solid var(--border-default)',
            color: 'var(--accent-purple)',
          }}
          dangerouslySetInnerHTML={{ __html: sanitizeSvg(icon.svgContent) }}
        />
      </div>

      {/* Actions */}
      <div style={{ padding: '0 16px' }}>
        <button
          onClick={handleCopy}
          style={{
            width: '100%',
            padding: '8px 12px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 8,
            color: 'var(--text-secondary)',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          {copied ? 'Copied!' : 'Copy SVG'}
        </button>
      </div>

      {/* Source Toggle */}
      <div style={{ padding: '12px 16px' }}>
        <button
          onClick={() => setShowSource(!showSource)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: 11,
            cursor: 'pointer',
            padding: 0,
          }}
        >
          {showSource ? 'Hide' : 'Show'} SVG Source
        </button>
      </div>

      {/* Source Code */}
      {showSource && (
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            margin: '0 16px 16px',
            padding: 12,
            background: 'var(--bg-primary)',
            borderRadius: 8,
            border: '1px solid var(--border-default)',
          }}
        >
          <pre
            style={{
              fontSize: 10,
              color: 'var(--text-secondary)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              margin: 0,
              fontFamily: 'monospace',
            }}
          >
            {icon.svgContent}
          </pre>
        </div>
      )}
    </div>
  );
}
