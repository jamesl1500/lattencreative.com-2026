import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, StatusBadge, EmptyState } from "@/components/ui";
import type { Package } from "@/lib/types";

export const metadata = { title: "Packages" };

const CATEGORY_LABELS: Record<Package["category"], string> = {
  website:     "Website Packages",
  bundle:      "Launch Bundles",
  maintenance: "Maintenance Plans",
  marketing:   "Marketing Packages",
};

const CATEGORY_ORDER: Package["category"][] = ["website", "bundle", "maintenance", "marketing"];

export default async function PackagesPage() {
  const supabase = await createClient();
  const { data: packages } = await supabase
    .from("packages")
    .select("*")
    .order("category")
    .order("sort_order");

  const grouped = CATEGORY_ORDER.reduce<Record<string, Package[]>>((acc, cat) => {
    acc[cat] = (packages ?? []).filter((p: Package) => p.category === cat);
    return acc;
  }, {} as Record<string, Package[]>);

  return (
    <div>
      <PageHeader
        title="Packages"
        description="All service packages offered on the website. Edit pricing and details here."
      />

      {(!packages || packages.length === 0) ? (
        <EmptyState
          title="No packages found"
          description="Packages from Supabase will appear here."
        />
      ) : (
        <div className="space-y-8">
          {CATEGORY_ORDER.map((category) => {
            const items = grouped[category];
            if (!items || items.length === 0) return null;

            return (
              <div key={category}>
                <h2 className="text-base font-semibold text-foreground mb-3">
                  {CATEGORY_LABELS[category]}
                </h2>
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left font-medium text-muted-foreground px-4 py-3">Package</th>
                        <th className="text-left font-medium text-muted-foreground px-4 py-3">Price</th>
                        <th className="text-left font-medium text-muted-foreground px-4 py-3">Deposit</th>
                        <th className="text-left font-medium text-muted-foreground px-4 py-3">Billing</th>
                        <th className="text-left font-medium text-muted-foreground px-4 py-3">Status</th>
                        <th className="text-left font-medium text-muted-foreground px-4 py-3">Bookings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((pkg: Package) => (
                        <tr
                          key={pkg.id}
                          className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-foreground">{pkg.title}</p>
                              {pkg.tagline && (
                                <p className="text-xs text-muted-foreground mt-0.5">{pkg.tagline}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium text-foreground">
                            {pkg.price_label}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {pkg.is_monthly ? "—" : `${pkg.deposit_percent}%`}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {pkg.is_monthly ? "Monthly" : "One-time"}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={pkg.is_active ? "active" : "inactive"} />
                          </td>
                          <td className="px-4 py-3">
                            <Link
                              href={`/bookings?package=${pkg.slug}`}
                              className="text-xs text-primary hover:underline"
                            >
                              View bookings →
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {CATEGORY_ORDER.map((cat) => (
              <Card key={cat}>
                <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[cat]}</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {grouped[cat]?.length ?? 0}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
