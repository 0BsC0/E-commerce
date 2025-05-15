import DashboardLayout from "@/layouts/DashboardLayout";
import CustomerOrdersView from "@/components/Orders/CustomerOrdersView";
import { useCustomerOrders } from "@/hooks/useCustomerOrders";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";

export default function MisPedidosPage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  // Solo ejecutamos el hook si el usuario existe
  const { orders, loading, statusMap } = useCustomerOrders(user?.token);

  useEffect(() => {
    if (!user || user.role !== "customer") {
      router.push("/login");
    }
  }, [user]);

  return (
    <DashboardLayout>
      <CustomerOrdersView
        orders={orders}
        loading={loading}
        statusMap={statusMap}
      />
    </DashboardLayout>
  );
}
