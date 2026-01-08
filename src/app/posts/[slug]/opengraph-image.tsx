import { ImageResponse } from "next/og";
import { getPostBySlug, getAllSlugs } from "@/lib/posts";
import { SITE_CONFIG } from "@/lib/constants";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const title = post?.frontmatter.title ?? "Post Not Found";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            maxWidth: "1000px",
          }}
        >
          <h1
            style={{
              fontSize: title.length > 60 ? "48px" : "64px",
              fontWeight: "bold",
              color: "#ffffff",
              lineHeight: 1.2,
              marginBottom: "40px",
            }}
          >
            {title}
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span
              style={{
                fontSize: "28px",
                color: "#d4a574",
              }}
            >
              {SITE_CONFIG.name}
            </span>
            <span
              style={{
                fontSize: "28px",
                color: "#666666",
              }}
            >
              •
            </span>
            <span
              style={{
                fontSize: "28px",
                color: "#888888",
              }}
            >
              {SITE_CONFIG.author.name}
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
