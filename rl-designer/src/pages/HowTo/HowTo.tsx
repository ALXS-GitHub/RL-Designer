import React from 'react';
import './HowTo.scss'
import CollapsibleSection from '@/components/CollapsibleSection/CollapsibleSection';
import UserGuideContent from '@docs/User-Guide.md?raw';
import DesignerGuide from '@docs/Designer-Guide.md?raw';
import SharingGuide from '@docs/Sharing-Guide.md?raw';
import ReactMarkdown from 'react-markdown';
import 'highlight.js/styles/github.css';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

const HowTo: React.FC = () => {

    const ImageRenderer = ({ src, alt, ...props }: any) => {
    // Transform relative paths to absolute public paths
    const imageSrc = src?.startsWith('images/') 
        ? `/docs/${src}` 
        : src;

    return (
        <img 
            src={imageSrc} 
            alt={alt} 
            className="markdown-image"
            loading="lazy"
            {...props}
        />
    );
};

    return (
        <div className="how-to">
            <h1 className="how-to__title">How to use RL Designer</h1>
            <div className="how-to__sections">
                <CollapsibleSection title="How to use the application">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                            img: ImageRenderer
                        }}
                    >
                        {UserGuideContent}
                    </ReactMarkdown>
                </CollapsibleSection>

                <CollapsibleSection title="How to create designs">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                            img: ImageRenderer
                        }}
                    >
                        {DesignerGuide}
                    </ReactMarkdown>
                </CollapsibleSection>

                <CollapsibleSection title="How to share your designs">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                            img: ImageRenderer
                        }}
                    >
                        {SharingGuide}
                    </ReactMarkdown>
                </CollapsibleSection>
            </div>
        </div>
    );
};

export default HowTo;