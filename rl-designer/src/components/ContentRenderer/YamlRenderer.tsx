import React, { useEffect } from 'react';
import * as yaml from 'js-yaml';
import Prism from 'prismjs';
import 'prismjs/components/prism-yaml';
import 'prismjs/themes/prism.css'; // or your preferred theme
import './YamlRenderer.scss';

interface YamlRendererProps {
    content: string;
    className?: string;
}

const YamlRenderer: React.FC<YamlRendererProps> = ({ 
    content, 
    className = '',
}) => {
    useEffect(() => {
        Prism.highlightAll();
    }, [content]);

    let yamlData: unknown;
    
    try {
        yamlData = yaml.load(content);
    } catch (error) {
        return (
            <div className={`yaml-renderer yaml-renderer--error ${className}`}>
                <span className="yaml-renderer__error">
                    Invalid YAML: {error instanceof Error ? error.message : 'Unknown error'}
                </span>
            </div>
        );
    }

    return (
        <div className={`yaml-renderer ${className}`}>
            <pre className="yaml-renderer__pre">
                <code className="language-yaml">
                    {content}
                </code>
            </pre>
        </div>
    );
};

export default YamlRenderer;