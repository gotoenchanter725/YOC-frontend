import React, { FC, MouseEventHandler, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import { BsX } from "react-icons/bs";
type Props = {
    show?: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    title?: string;
}

const Modal: FC<Props> = ({ show, onClose, children, title }) => {
    const [isBrowser, setIsBrowser] = useState(false);
    useEffect(() => {
        setIsBrowser(true);
    }, []);

    const handleCloseClick: React.MouseEventHandler<SVGAElement> = (e) => {
        e.preventDefault();
        onClose();
    };

    const modalContent = show ? (
        <StyledModalOverlay>
            <StyledModal>
                <StyledModalHeader>
                    <BsX className="close_icon" color="black" onClick={handleCloseClick} />
                </StyledModalHeader>
                {title && <StyledModalTitle>{title}</StyledModalTitle>}
                <StyledModalBody>{children}</StyledModalBody>
            </StyledModal>
        </StyledModalOverlay>
    ) : null;

    if (isBrowser) {
        return ReactDOM.createPortal(
            modalContent,
            document.getElementById("modal-root")!
        );
    } else {
        return null;
    }
}

const StyledModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.5);
`;

const StyledModal = styled.div`
    max-height: 600px;
    background: white;
    border-radius: 15px;
    padding: 15px;
`;
const StyledModalHeader = styled.div`
    display: flex;
    justify-content: flex-end;
    font-size: 25px;
`;
const StyledModalTitle = styled.div`
    font-size: 20px;
    color: black;
    text-align: center;
`;
const StyledModalBody = styled.div`
    max-height: 500px;
    overflow: auto;
    display: flex;
    justify-content: center;
`;


export default Modal;