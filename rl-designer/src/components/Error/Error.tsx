import React from 'react';
import './Error.scss';

interface ErrorProps {
  message: string;
  fullPage?: boolean;
}

const Error: React.FC<ErrorProps> = ({ message, fullPage = false }) => {
  const overlayClassName = fullPage ? 'error-overlay error-overlay--full-page' : 'error-overlay';

  return (
    <div className={overlayClassName}>
      <div className="error-content">
        <div className="error-icon">⚠️</div>
        <div className="error-text">{message}</div>
      </div>
    </div>
  );
};

export default Error;