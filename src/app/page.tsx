import MainBanner from "@/components/Main-baner";
import ProductsFeatured from "@/components/productsFeatured";
import NewProducts from "@/components/newProducts";
export default function Page() {
  return (
    <div>
      <MainBanner />
      <ProductsFeatured />
      <NewProducts />
    </div>
  );
}