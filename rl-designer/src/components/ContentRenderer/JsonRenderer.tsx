import React, { useEffect } from 'react';
import JsonView from '@uiw/react-json-view';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism.css'; // or your preferred theme
import './JsonRenderer.scss';

interface JsonRendererProps {
    content: string | object;
    asString?: boolean;
    className?: string;
    collapsed?: boolean;
    interactive?: boolean;
}

const JsonRenderer: React.FC<JsonRendererProps> = ({ 
    content, 
    asString = false, 
    className = '',
    collapsed = false,
    interactive = false,
}) => {
    let jsonData: object;
    let jsonString: string;
    
    useEffect(() => {
        if (asString) {
            Prism.highlightAll();
        }
    }, [content, asString]);

    try {
        // If content is already an object, use it directly
        if (typeof content === 'object' && content !== null) {
            jsonData = content;
            jsonString = JSON.stringify(content, null, 2);
        } else {
            // Parse the JSON string to validate it
            jsonData = JSON.parse(content as string);
            jsonString = JSON.stringify(jsonData, null, 2);
        }
    } catch (error) {
        return (
            <div className={`json-renderer json-renderer--error ${className}`}>
                <span className="json-renderer__error">
                    Invalid JSON: {error instanceof Error ? error.message : 'Unknown error'}
                </span>
            </div>
        );
    }

    if (asString) {
        return (
            <div className={`json-renderer json-renderer--string ${className}`}>
                <pre className="json-renderer__pre">
                    <code className="language-json">
                        {jsonString}
                    </code>
                </pre>
            </div>
        );
    }

    return (
        <div className={`json-renderer ${interactive ? 'json-renderer--interactive' : ''} ${className}`}>
            <JsonView
                value={jsonData}
                style={{
                    '--w-rjv-font-family': 'monospace',
                    '--w-rjv-color': 'var(--color-text)',
                    '--w-rjv-background-color': 'var(--color-background-secondary)',
                    '--w-rjv-border-color': 'var(--color-border)',
                    '--w-rjv-key-color': 'var(--color-primary)',
                    '--w-rjv-string-color': 'var(--color-success)',
                    '--w-rjv-number-color': 'var(--color-warning)',
                    '--w-rjv-boolean-color': 'var(--color-info)',
                    '--w-rjv-null-color': 'var(--color-danger)',
                } as React.CSSProperties}
                collapsed={collapsed}
                enableClipboard={false}
            />
        </div>
    );
};

export default JsonRenderer;