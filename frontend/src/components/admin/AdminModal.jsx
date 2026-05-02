import { X } from "lucide-react";

const AdminModal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 py-6">
    <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-lg bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-black text-slate-900">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="max-h-[calc(90vh-65px)] overflow-y-auto p-5">
        {children}
      </div>
    </div>
  </div>
);

export default AdminModal;
