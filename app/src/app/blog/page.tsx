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

export default async function BlogIndexPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const qs = (await searchParams) ?? {};
  const page = Math.max(1, Number(qs.page) || 1);
  const limit = 9;

  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/cms/blog?page=${page}&limit=${limit}`, { cache: "no-store" });
  const data = res.ok ? await res.json() : { posts: [], total: 0, totalPages: 1, page };
  const posts = Array.isArray(data?.posts) ? data.posts : [];
  const totalPages = Math.max(1, Number(data?.totalPages) || 1);
  const currentPage = Math.min(page, totalPages);

  const makePageHref = (p: number) => `/blog?page=${p}`;

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

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <Link
              href={makePageHref(Math.max(1, currentPage - 1))}
              aria-disabled={currentPage === 1}
              className={`rounded-full border px-3 py-2 text-sm font-semibold ${
                currentPage === 1 ? "cursor-not-allowed text-muted-foreground" : "hover:border-primary hover:text-primary"
              }`}
            >
              Előző
            </Link>
            <span className="text-sm text-muted-foreground">
              {currentPage} / {totalPages}
            </span>
            <Link
              href={makePageHref(Math.min(totalPages, currentPage + 1))}
              aria-disabled={currentPage === totalPages}
              className={`rounded-full border px-3 py-2 text-sm font-semibold ${
                currentPage === totalPages
                  ? "cursor-not-allowed text-muted-foreground"
                  : "hover:border-primary hover:text-primary"
              }`}
            >
              Következő
            </Link>
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
