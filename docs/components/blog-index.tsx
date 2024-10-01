import { getPagesUnderRoute } from "nextra/context"
import Link from "next/link"
import { useRouter } from "next/router"

export default function BlogIndex({ more = "Read more" }) {
  const { locale = "", defaultLocale = "" } = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return getPagesUnderRoute("/blog").map((page: any) => {
    return (
      <div key={page.route} className="mb-10">
        <h3>
          <Link
            href={page.route}
            style={{ color: "inherit", textDecoration: "none" }}
            className="block mt-8 text-2xl font-semibold "
          >
            {page.meta?.title || page.frontMatter?.title || page.name}
          </Link>
        </h3>
        <p className="mt-6 leading-7 opacity-80">
          {page.frontMatter?.description}{" "}
          <span className="inline-block">
            <Link
              href={page.route}
              className="text-[color:hsl(var(--nextra-primary-hue),100%,50%)] underline underline-offset-2 decoration-from-font"
            >
              {more + " →"}
            </Link>
          </span>
        </p>
        {page.frontMatter?.date ? (
          <p className="mt-6 text-sm leading-7 opacity-50">{page.frontMatter.date}</p>
        ) : null}
      </div>
    )
  })
}
