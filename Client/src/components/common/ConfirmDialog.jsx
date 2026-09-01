import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Estás seguro?',
  message = 'Esta acción no se puede deshacer.',
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" showCloseButton={false}>
      <div className="text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className="text-base font-bold text-slate-800">{title}</h4>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Button variant="secondary" onClick={onClose} disabled={isLoading} className="w-full sm:w-auto">
          {cancelText}
        </Button>
        <Button
          variant={variant}
          onClick={onConfirm}
          isLoading={isLoading}
          className="w-full sm:w-auto"
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
