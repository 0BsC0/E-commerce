import DashboardLayout from "@/layouts/DashboardLayout";
import OrdersView from "@/components/Orders/OrdersView";
import { useOrders } from "@/hooks/useOrders";

export default function AdminOrdersPage() {
  const {
    orders,
    loading,
    statusMap,
    handleStatusChange,
    handleDeleteOrderView,
  } = useOrders();

  return (
    <DashboardLayout>
      <OrdersView
        orders={orders}
        loading={loading}
        statusMap={statusMap}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteOrderView}
      />
    </DashboardLayout>
  );
}
