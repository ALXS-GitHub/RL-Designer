import React, { useState, useEffect, use } from "react";
import { useQuery } from "@tanstack/react-query";
import Modal from "react-modal";
import { useDecalInformationModalStore } from "@/stores/decalInformationModalStore";
import Button from "@/components/Button/Button";
import { JsonRenderer, YamlRenderer } from "@/components/ContentRenderer";
import { useLocation } from "react-router-dom";
import { Loading, Error } from '@/components'
import FileViewerModal from "./FileViewerModal";
import { FaTimes } from 'react-icons/fa';

import "./DecalInformationModal.scss";
import { decodeFileName, getBaseName, getFileContent, resolvePath } from "@/utils/files";

Modal.setAppElement("#root");

interface FileContentSectionProps {
    filePath: string | null;
    label: string;
    renderContent?: (content: unknown) => React.ReactNode;
}

const FileContentSection: React.FC<FileContentSectionProps> = ({ filePath, label, renderContent }) => {

    const { data: fileContent, isLoading, isError } = useQuery({
        queryKey: ['fileContent', filePath],
        queryFn: () => getFileContent(resolvePath(filePath))
    });

    if (!filePath) return null;

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return <Error message="Failed to load file content" />;
    }

    if (!renderContent && typeof fileContent !== 'string' && !React.isValidElement(fileContent)) {
        return null;
    }

    return (
        <div className="decal-information-modal__modal__section">
            <span className="decal-information-modal__modal__section__label">{label}:</span>
            <span className="decal-information-modal__modal__section__file-display">
                {renderContent ? renderContent(fileContent) : fileContent}
            </span>
        </div>
    );
};

const DecalInformationModal: React.FC = () => {
    const { isOpen, decalVariant, closeModal } = useDecalInformationModalStore();
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [fileViewerOpen, setFileViewerOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (isOpen) {
            closeModal();
        }
    }, [location.pathname]);
    
    if (!decalVariant) return null;
    const variant = decalVariant.decal.variants.find(v => v.variant_name === decalVariant.variant_name);

    const handleClose = () => {
        closeModal();
    };



    const handleFileClick = (filePath: string) => {
        setSelectedFile(filePath);
        setFileViewerOpen(true);
    };

    const handleFileViewerClose = () => {
        setFileViewerOpen(false);
        setSelectedFile(null);
    };

    const handleBackToDecalInfo = () => {
        setFileViewerOpen(false);
        setSelectedFile(null);
        // Keep the decal info modal open
    };

    const jsonFiles = variant.files.filter(file => file.endsWith(".json"));
    const templateJson = jsonFiles.length > 0 ? jsonFiles[0] : null;
    const metadataYaml = variant.files.find(file => file.endsWith("metadata.yaml")) ?? null;

    if (!variant) return null;

    return (
        <>
            <FileViewerModal
                isOpen={fileViewerOpen}
                filePath={selectedFile}
                onClose={handleFileViewerClose}
                onBack={handleBackToDecalInfo}
            />

            <Modal
                isOpen={isOpen}
                onRequestClose={handleClose}
                contentLabel="Decal Information"
                className="decal-information-modal__modal"
                overlayClassName="decal-information-modal__overlay"
            >
                <div className="decal-information-modal__modal__container">
                <Button className="decal-information-modal__close-button" onClick={handleClose}>
                    <FaTimes />
                </Button>

                <div className="decal-information-modal__modal__title">{decalVariant.decal.name}</div>
                <div className="decal-information-modal__modal__subtitle">{variant.variant_name}</div>

                <div className="decal-information-modal__modal__section">
                    <span className="decal-information-modal__modal__section__label">Files:</span>
                    <span className="decal-information-modal__modal__section__files">
                        {variant.files.map((file, index) => (
                            <span 
                                key={index} 
                                className="decal-information-modal__modal__section__file"
                                onClick={() => handleFileClick(file)}
                            >
                                {decodeFileName(getBaseName(file))}
                            </span>
                        ))}
                    </span>
                </div>

                {metadataYaml && (
                    <FileContentSection 
                        filePath={metadataYaml} 
                        label="Metadata YAML" 
                        renderContent={(content) => (
                            <YamlRenderer content={content as string} />
                        )}
                    />
                )}

                {templateJson && (
                    <FileContentSection 
                        filePath={templateJson} 
                        label="Template JSON" 
                        renderContent={(content) => (
                            <JsonRenderer content={content as object} asString={true} collapsed={false} />
                        )}
                    />
                )}

                </div>
            </Modal>
        </>
    );
};

export default DecalInformationModal;
