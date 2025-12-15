import AllProductsPage from "@/app/kategoria/osszes/page";

// Ugyanaz a tartalom, saját útvonalon.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function LaptopokOsszes(props: any) {
  return <AllProductsPage {...props} />;
}
