import React, { useState, useEffect } from 'react';
import './HowTo.scss'
import CollapsibleSection from '@/components/CollapsibleSection/CollapsibleSection';
import ReactMarkdown from 'react-markdown';
import 'highlight.js/styles/github.css';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Loading, Error as ErrorComponent } from '@/components';
import Requirements from './Sections/Requirements';
import { GITHUB_REPO_RAW_URL } from '@/constants';

interface DocumentContent {
    userGuide: string;
    designerGuide: string;
    sharingGuide: string;
}

const HowTo: React.FC = () => {
    const [content, setContent] = useState<DocumentContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch all markdown files concurrently
                const [userGuideResponse, designerGuideResponse, sharingGuideResponse] = await Promise.all([
                    fetch(`${GITHUB_REPO_RAW_URL}/docs/User-Guide.md`),
                    fetch(`${GITHUB_REPO_RAW_URL}/docs/Designer-Guide.md`),
                    fetch(`${GITHUB_REPO_RAW_URL}/docs/Sharing-Guide.md`)
                ]);

                // Check if all requests were successful
                if (!userGuideResponse.ok || !designerGuideResponse.ok || !sharingGuideResponse.ok) {
                    throw new Error('Failed to fetch one or more documentation files');
                }

                // Get text content from all responses
                const [userGuideText, designerGuideText, sharingGuideText] = await Promise.all([
                    userGuideResponse.text(),
                    designerGuideResponse.text(),
                    sharingGuideResponse.text()
                ]);

                setContent({
                    userGuide: userGuideText,
                    designerGuide: designerGuideText,
                    sharingGuide: sharingGuideText
                });
            } catch (err) {
                console.error('Error fetching documentation:', err);
                setError(err instanceof Error ? err.message : 'Failed to load documentation');
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, []);

    const ImageRenderer = ({ src, alt, ...props }: any) => {
        // Transform relative image paths to GitHub raw URLs
        let imageSrc = src;
        
        if (src?.startsWith('images/')) {
            imageSrc = `${GITHUB_REPO_RAW_URL}/docs/${src}`;
        } else if (src?.startsWith('./images/')) {
            imageSrc = `${GITHUB_REPO_RAW_URL}/docs/${src.substring(2)}`;
        } else if (src?.startsWith('../images/')) {
            imageSrc = `${GITHUB_REPO_RAW_URL}/docs/${src.substring(3)}`;
        }

        return (
            <img 
                src={imageSrc} 
                alt={alt} 
                className="markdown-image"
                loading="lazy"
                onError={(e) => {
                    console.error(`Failed to load image: ${imageSrc}`);
                    // Optionally set a fallback image or hide the broken image
                    e.currentTarget.style.display = 'none';
                }}
                {...props}
            />
        );
    };

    const LinkRenderer = ({ href, children, ...props }: any) => {
        // Transform relative links to GitHub URLs if needed
        // TODO : manage internal md links (#)
        let linkHref = href;
        
        if (href?.startsWith('./') || href?.startsWith('../')) {
            // Convert relative links to GitHub URLs
            linkHref = `${GITHUB_REPO_RAW_URL}/docs/${href.replace(/^\.\.?\//, '')}`;
        }

        return (
            <a 
                href={linkHref} 
                target={href?.startsWith('http') ? '_blank' : '_self'}
                rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                {...props}
            >
                {children}
            </a>
        );
    };

    const markdownComponents = {
        img: ImageRenderer,
        a: LinkRenderer
    };

    if (loading) {
        return (
            <Loading fullPage/>
        );
    }

    if (error || !content) {
        return (
                <ErrorComponent message={error || 'Failed to load documentation'} fullPage />
        );
    }

    return (
        <div className="how-to">
            <h1 className="how-to__title">How to use RL Designer</h1>
            <div className="how-to__sections">
                <CollapsibleSection title="Requirements">
                    <Requirements />
                </CollapsibleSection>
                <CollapsibleSection title="How to use the application">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={markdownComponents}
                    >
                        {content.userGuide}
                    </ReactMarkdown>
                </CollapsibleSection>

                <CollapsibleSection title="How to create designs">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={markdownComponents}
                    >
                        {content.designerGuide}
                    </ReactMarkdown>
                </CollapsibleSection>

                <CollapsibleSection title="How to share your designs">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={markdownComponents}
                    >
                        {content.sharingGuide}
                    </ReactMarkdown>
                </CollapsibleSection>
            </div>
        </div>
    );
};

export default HowTo;