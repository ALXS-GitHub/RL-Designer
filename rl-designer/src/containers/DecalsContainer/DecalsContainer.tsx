import React from 'react';
import useSelectedElementStore from '@/stores/selectedElementStore';
import ElementTypeSelect from '@/components/DropdownMenu/ElementTypeSelect/ElementTypeSelect';
import UpdateAllButton from '@/components/UpdateAllButton/UpdateAllButton';
import { useExplorerData } from '@/hooks/useExplorer';
import { Loading } from '@/components';

import './DecalsContainer.scss';

interface DecalsContainerProps {
  children?: React.ReactNode;
}

export const DecalsContainer = ({children }: DecalsContainerProps) => {

    const { selectedElement, setSelectedElement } = useSelectedElementStore();

    return (
        <div className="decals-container">
            <div className="decals-container__settings">
                <ElementTypeSelect
                selectedElement={selectedElement}
                onElementChange={setSelectedElement}
                className="decals-container__element-select"
                />
                <UpdateAllButton className="decals-container__update-all-button" />
            </div>
            <div className="decals-container__content">
                {children}
            </div>
        </div>
    );
};

export default DecalsContainer;