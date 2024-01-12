import React, {useEffect, useRef} from "react";


interface ModalProps {
    isOpen: boolean;
    onClose?: () => void;
    children: React.ReactNode;
    className: string
}

const isClickInsideRectangle = (e: MouseEvent, element: HTMLElement) => {
    const r = element.getBoundingClientRect();

    return (
        e.clientX > r.left &&
        e.clientX < r.right &&
        e.clientY > r.top &&
        e.clientY < r.bottom
    );
};

const Modal: React.FC<ModalProps> = ({isOpen, onClose, children, className}) => {
    const modalRef = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        const modalElement = modalRef.current;
        if (modalElement) {
            if (isOpen) {
                modalElement.showModal();
            } else {
                modalElement.close();
            }
        }
    }, [isOpen]);

    return (
        <dialog
            ref={modalRef}
            className={`modal ${className}`}
            onKeyDown={(event: React.KeyboardEvent<HTMLDialogElement>) => {
                if (event.key === "Escape") {
                    if (onClose) {
                        onClose();
                    }
                }
            }}
            onClick={(e) => {
                // @ts-ignore
                if (modalRef.current && !isClickInsideRectangle(e, modalRef.current) && onClose)
                    onClose();
            }}
        >
            {children}
        </dialog>
    );
};

export default Modal;