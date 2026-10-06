import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import { SecondaryButton } from "./FormControls";

export default function ConfirmDialog({ title, message, confirmLabel = "Excluir", onConfirm, onClose }) {
  return (
    <Modal
      title={title}
      icon={<AlertTriangle className="w-5 h-5 text-[#ef4444]" />}
      onClose={onClose}
    >
      <p className="text-sm text-[#a1a1aa] leading-relaxed">{message}</p>
      <div className="grid grid-cols-2 gap-2.5 mt-5">
        <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="w-full py-3 bg-[#ef4444] hover:bg-[#dc2626] text-[#fafafa] font-bold rounded-xl text-sm cursor-pointer transition-colors"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
