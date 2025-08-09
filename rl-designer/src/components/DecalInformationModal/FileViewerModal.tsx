// FileViewerModal.tsx
import React from 'react';
import Modal from 'react-modal';
import { JsonRenderer, YamlRenderer } from '@/components/ContentRenderer';
import { getBaseName, getFileExtension, decodeFileName } from '@/utils/files';
import './FileViewerModal.scss';
import Button from '@/components/Button/Button';
import { FaTimes, FaArrowLeft } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { getFileContent, resolvePath } from '@/utils/files';
import { Loading, Error } from "@/components";

interface FileViewerModalProps {
    isOpen: boolean;
    filePath: string | null;
    onClose: () => void;
    onBack?: () => void; // Optional back button to return to decal info
}

const FileViewerModal: React.FC<FileViewerModalProps> = ({
    isOpen,
    filePath,
    onClose,
    onBack
}) => {

    const { data: fileContent, isLoading, isError } = useQuery({
        queryKey: ['fileContent', filePath],
        queryFn: () => getFileContent(resolvePath(filePath)),
        enabled: !!filePath
    });

    if (!filePath) return null;
    
    const fileName = decodeFileName(getBaseName(filePath));
    const extension = getFileExtension(filePath).toLowerCase();

    const renderContent = () => {
        switch (extension) {
            case 'json':
                return <JsonRenderer content={fileContent as object} collapsed={false} />;
            case 'yaml':
            case 'yml':
                return <YamlRenderer content={fileContent as string} />;
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'webp':
                return (
                    <div className="file-viewer-modal__image-container">
                        <img 
                            src={resolvePath(filePath)} 
                            alt={fileName} 
                            className="file-viewer-modal__image" 
                        />
                    </div>
                );
            case 'txt':
            case 'md':
                return (
                    <pre className="file-viewer-modal__text">
                        {fileContent as string}
                    </pre>
                );
            default:
                return (
                    <div className="file-viewer-modal__unsupported">
                        <p>Preview not available for .{extension} files</p>
                        <p>File: {fileName}</p>
                    </div>
                );
        }
    };

    const ModalWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
        return (
            <Modal
            isOpen={isOpen}
                onRequestClose={onClose}
                contentLabel={`File Viewer - ${fileName}`}
                className="file-viewer-modal__modal"
                overlayClassName="file-viewer-modal__overlay"
            >
                {children}
            </Modal>
        );
    };

    if (isLoading) return <ModalWrapper><Loading /></ModalWrapper>;
    if (isError || !fileContent) return <ModalWrapper><Error message="Failed to load file content" /></ModalWrapper>;

    return (
        <ModalWrapper>
            <div className="file-viewer-modal__container">
                <div className="file-viewer-modal__buttons">
                    {onBack && (
                        <Button 
                            className="file-viewer-modal__back-button" 
                            onClick={onBack}
                        >
                            <FaArrowLeft />
                        </Button>
                    )}
                    <h2 className="file-viewer-modal__title">{fileName}</h2>
                    <Button
                        className="file-viewer-modal__close-button"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <FaTimes />
                    </Button>
                </div>
                <div className="file-viewer-modal__content">
                    {renderContent()}
                </div>
            </div>
        </ModalWrapper>
    );
};

export default FileViewerModal;