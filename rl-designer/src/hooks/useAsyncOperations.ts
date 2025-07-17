import { useState } from 'react';
import { useNotificationStore } from '@/stores/notificationsStore';

export interface ExecuteAsyncOptions {
    onMutation?: () => void; // Optional callback to handle data after mutation
    defaultLoadingState?: boolean; // Optional default loading state
}

interface ExecuteAsyncParams<T> {
    operation: () => Promise<T>;
    successMessage?: string;
    errorMessage?: string;
    showNotifications?: boolean; // Optional flag to control notification behavior
}

export const useAsyncOperations = ({
    onMutation,
    defaultLoadingState = true,
}: ExecuteAsyncOptions = {}) => {
    const [isLoading, setIsLoading] = useState(defaultLoadingState);
    const [isError, setIsError] = useState<Error | null>(null);
    const { error: errorNotification, success: successNotification } = useNotificationStore();

    const executeAsync = async <T>({ operation, successMessage, errorMessage, showNotifications = true }: ExecuteAsyncParams<T>): Promise<T | undefined> => {
        setIsLoading(true);
        setIsError(null);
        try {
            const result = await operation();
            onMutation?.();
            if (successMessage && showNotifications) successNotification(successMessage);
            return result;
        } catch (error: any) {
            setIsError(error);
            console.error('Error during operation:', error);
            if (showNotifications) {
                if (errorMessage) {
                    errorNotification(errorMessage);
                } else {
                    errorNotification('An error occurred while processing your request.');
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        isError,
        executeAsync
    };
};

