import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";
import { PortableText } from "@portabletext/react";

export const revalidate = 0;

async function fetchPost(slug: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/cms/blog/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) return {};
  return {
    title: `${post.seoTitle || post.title} | WELLCOMP Blog`,
    description: post.seoDescription || post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) notFound();

  const tags: string[] = Array.isArray(post.tags) ? post.tags : [];
  const bodyBlocks = post.content || post.body || [];

  return (
    <div className="min-h-screen text-foreground">
      <ProductHeader />
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 pb-16 pt-6">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Link className="hover:text-primary" href="/">
            Főoldal
          </Link>
          <span>/</span>
          <Link className="hover:text-primary" href="/blog">
            Blog
          </Link>
          <span>/</span>
          <span className="text-foreground">{post.title}</span>
        </div>

        <article className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-lg shadow-black/30">
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
          <h1 className="text-3xl font-extrabold leading-tight">{post.title}</h1>
          <p className="text-sm text-muted-foreground">{post.excerpt}</p>
          {post.image?.url && (
            <div className="overflow-hidden rounded-xl border border-border">
              <div className="relative h-[420px] w-full">
                <Image
                  fill
                  src={post.image.url}
                  alt={post.title}
                  className="object-cover"
                  sizes="(min-width: 768px) 60vw, 100vw"
                  unoptimized
                />
              </div>
            </div>
          )}
          <div className="prose max-w-none">
            {bodyBlocks && bodyBlocks.length > 0 ? <PortableText value={bodyBlocks} /> : null}
          </div>
        </article>
      </div>
      <SiteFooter />
    </div>
  );
}
