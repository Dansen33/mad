import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { sanityClient } from "@/lib/sanity";
import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";
import { SignOutButton } from "@/components/sign-out-button";
import { AddressManager } from "@/components/address-manager";

export const dynamic = "force-dynamic";

type OrderItem = {
  name?: string;
  quantity?: number;
  priceHuf?: number;
};

type Order = {
  _id: string;
  createdAt: string;
  status?: string;
  totalHuf?: number;
  items?: OrderItem[];
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/bejelentkezes");
  }

  const orders = await sanityClient.fetch<Order[]>(
    `*[_type=="order" && lower(email)==lower($email)]|order(createdAt desc)[0...10]{
      _id, createdAt, status, totalHuf, items[]{name, quantity, priceHuf}
    }`,
    { email: session.user.email },
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProductHeader />
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 pb-16 pt-10 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-lg shadow-black/20">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase text-primary">Felhasználó</div>
              <h1 className="text-2xl font-extrabold">{session.user.name || session.user.email}</h1>
              <p className="text-sm text-muted-foreground">{session.user.email}</p>
            </div>
            <SignOutButton />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-lg shadow-black/20">
            <div className="mb-3">
              <h2 className="text-lg font-extrabold">Személyes adatok</h2>
              <p className="text-xs text-muted-foreground">
                Ezeket tölti elő a pénztár (név, email; címek lent).
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between rounded-lg border border-border bg-secondary px-3 py-2">
                <span className="text-muted-foreground">Név</span>
                <span className="font-semibold text-foreground">{session.user.name || "—"}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-secondary px-3 py-2">
                <span className="text-muted-foreground">Email</span>
                <span className="font-semibold text-foreground">{session.user.email}</span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Címek</h3>
              <AddressManager />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-lg shadow-black/20">
            <div className="mb-3">
              <h2 className="text-lg font-extrabold">Korábbi rendelések</h2>
              <p className="text-xs text-muted-foreground">Legutóbbi 10 rendelés.</p>
            </div>
            {orders.length === 0 && (
              <div className="text-sm text-muted-foreground">Még nincs rendelés.</div>
            )}
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-lg border border-border bg-secondary/60 p-3 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      {new Date(order.createdAt).toLocaleDateString("hu-HU")}
                    </span>
                    <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
                      {order.status || "Leadva"}
                    </span>
                  </div>
                  <div className="text-muted-foreground">
                    Végösszeg:{" "}
                    <span className="font-semibold text-foreground">
                      {new Intl.NumberFormat("hu-HU").format(order.totalHuf || 0)} Ft
                    </span>
                  </div>
                  {order.items && order.items.length > 0 && (
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
                      {order.items.slice(0, 3).map((it, idx) => (
                        <li key={idx}>
                          {it.name} × {it.quantity} —{" "}
                          {new Intl.NumberFormat("hu-HU").format((it.priceHuf || 0) * (it.quantity || 1))} Ft
                        </li>
                      ))}
                      {order.items.length > 3 && <li>…</li>}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
