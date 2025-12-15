import Link from "next/link";
import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";

type BlogPost = {
  _id?: string;
  slug?: string;
  title: string;
  excerpt?: string;
  tags?: string[];
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogIndexPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/cms/blog`, { cache: "no-store" });
  const posts = res.ok ? await res.json() : [];

  return (
    <div className="min-h-screen text-foreground">
      <ProductHeader />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-16 pt-6">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Link className="hover:text-primary" href="/">
            Főoldal
          </Link>
          <span>/</span>
          <span className="text-foreground">Blog</span>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/30">
          <div className="flex flex-col gap-1">
            <div className="text-xs uppercase text-primary">Blog</div>
            <h1 className="text-2xl font-extrabold">Legfrissebb bejegyzések</h1>
            <p className="text-sm text-muted-foreground">
              Tippek, útmutatók és hírek felújított laptopokról, üzleti és gamer modellekről.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {posts.map((post: BlogPost) => {
            const tags: string[] = Array.isArray(post.tags) ? post.tags : [];
            return (
              <div
                key={post.slug || post._id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-lg shadow-black/30"
              >
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-lg font-bold text-foreground">{post.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                <Link
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-secondary px-3 py-2 text-xs font-semibold text-foreground hover:border-primary/60"
                  href={`/blog/${post.slug}`}
                >
                  Olvasás
                </Link>
              </div>
            );
          })}
          {posts.length === 0 && (
            <div className="col-span-full rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
              Még nincsenek bejegyzések.
            </div>
          )}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
