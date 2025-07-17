import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

import './CheckBox.scss';

interface CheckBoxProps {
    checked: boolean;
    onChange: (checked : boolean) => void;
}

const CheckBox = ({ checked, onChange }: CheckBoxProps) => {

    const handleClick = () => {
        onChange(!checked);
    };

    return (
        <div className="checkbox" onClick={handleClick}>
            <div className="checkbox__container">
                {checked ? 
                    <FaCheck className="checkbox__icon checkbox__icon--checked" />
                    : <FaTimes className="checkbox__icon checkbox__icon--unchecked" />
                }
            </div>
        </div>
    );
};

export default CheckBox;