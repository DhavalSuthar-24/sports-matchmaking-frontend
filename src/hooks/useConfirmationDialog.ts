import { useState, useCallback } from 'react';

export function useConfirmationDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [action, setAction] = useState<(() => void) | null>(null);
    const [content, setContent] = useState({ title: "", description: "" });

    const show = useCallback((title: string, description: string, onConfirm: () => void) => {
        setContent({ title, description });
        setAction(() => onConfirm); // Store the confirmation callback
        setIsOpen(true);
    }, []);

    const handleConfirm = useCallback(() => {
        if (action) {
            action();
        }
        setIsOpen(false);
        setAction(null);
    }, [action]);

    const handleCancel = useCallback(() => {
        setIsOpen(false);
        setAction(null);
    }, []);

    return {
        isOpen,
        content,
        show,
        handleConfirm,
        handleCancel,
        setIsOpen // Expose setIsOpen for direct control if needed
    };
}