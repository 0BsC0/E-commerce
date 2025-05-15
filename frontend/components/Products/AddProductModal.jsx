import Modal from "@/components/ui/Modal";
import AddProductForm from "@/components/Products/AddProductForm";

export default function AddProductModal({ isOpen, onClose, onProductCreated }) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🌿 Agregar nuevo producto">
      <AddProductForm onProductCreated={onProductCreated} />
    </Modal>
  );
}
