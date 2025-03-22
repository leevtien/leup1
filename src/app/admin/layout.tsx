// src/app/admin/layout.tsx
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}

// src/app/admin/page.tsx
import AdminDashboard from '@/components/admin/Dashboard';

export default function AdminPage() {
  return <AdminDashboard />;
}

// src/app/admin/products/page.tsx
import ProductList from '@/components/admin/products/ProductList';

export default function ProductsPage() {
  return <ProductList />;
}

// src/app/admin/products/new/page.tsx
import ProductForm from '@/components/admin/products/ProductForm';

export default function NewProductPage() {
  return <ProductForm />;
}

// src/app/admin/products/[id]/edit/page.tsx
import ProductForm from '@/components/admin/products/ProductForm';

export default function EditProductPage({ params }: { params: { id: string } }) {
  return <ProductForm productId={params.id} />;
}

// src/app/admin/orders/page.tsx
import OrderList from '@/components/admin/orders/OrderList';

export default function OrdersPage() {
  return <OrderList />;
}

// Additional admin pages for categories, customers, etc.