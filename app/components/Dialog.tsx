"use client";
import { useSearchParams } from "next/navigation";
import { useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";

type Props = {
  title: string | null;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Dialog({ title, onClose, children }: Props) {
  const searchParams = useSearchParams();
  const dialogRef = useRef<null | HTMLDialogElement>(null);
  const showDialog = searchParams?.get("showDialog");
  
  useEffect(() => {
    if (showDialog === "y") {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [showDialog]);

  const closeDialog = () => {
    dialogRef.current?.close();
    onClose();
    removeShowDialogParam();
  };

  const removeShowDialogParam = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("showDialog");
    window.history.replaceState({}, "", url.toString());
  };

  const dialog: JSX.Element | null =
    showDialog === "y" ? (
      <dialog
        ref={dialogRef}
        className="z-10 rounded-xl backdrop:bg-gray-800/50"
      >
        <div className="w-[700px] max-w-full bg-background flex flex-col">
          <div className="flex flex-row justify-between mb-4 pt-2 px-5 bg-orange">
            <h1 className="mb-2 text-white">{title}</h1>
            <button
              onClick={closeDialog}
              className="mb-2 py-1 px-2 cursor-pointer text-white"
            >
              <IoClose className="text-2xl" />
            </button>
          </div>
          <div className="px-5">{children}</div>
        </div>
      </dialog>
    ) : null;

  return dialog;
}
