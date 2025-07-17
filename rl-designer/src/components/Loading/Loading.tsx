import React from 'react';
import './Loading.scss';

interface LoadingProps {
  fullPage?: boolean;
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  fullPage = false, 
  message = "Loading..." 
}) => {
  const overlayClassName = fullPage ? 'loading-overlay loading-overlay--full-page' : 'loading-overlay';

  return (
    <div className={overlayClassName}>
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <div className="loading-text">{message}</div>
      </div>
    </div>
  );
};

export default Loading;