import React from "react";
import ReactDom from "react-dom";
import classes from "../../styles/Modal.module.css";

const Backdrop = (props: { className?: string }) => {
  return (
    <div className={`${classes.backdrop} w-full ${props.className}`}></div>
  );
};

const ModalOverlay = (props: {
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
}) => {
  return (
    <div className="fixed flex  justify-center items-center inset-0 overflow-y-auto z-[199] pb-10  ">
      <div className={`${classes.modal} py-6  px-3  ${props.className}`}>
        <div
          className={`${classes.content} md:w-96 xs:w-80  ${props.overlayClassName}`}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
};

const portalElement = document.getElementById("overlays") as HTMLElement;

const Modal = (props: {
  children: React.ReactNode;
  className?: string;
  backdropClassName?: string;
  overlayClassName?: string;
}) => {
  return (
    <div className="w-96 absolute">
      {ReactDom.createPortal(
        <Backdrop className={props.backdropClassName} />,
        portalElement
      )}
      {ReactDom.createPortal(
        <ModalOverlay
          className={props.className}
          overlayClassName={props.overlayClassName}
        >
          {props.children}
        </ModalOverlay>,
        portalElement
      )}
    </div>
  );
};

export default Modal;
