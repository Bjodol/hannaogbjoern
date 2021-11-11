import cn from "classnames";
import Link from "next/link";
import { imageBuilder } from "../lib/sanity";

export default function CoverImage({ title, url, imageObject, slug }) {
  const image = (
    <img
      width={1240}
      height={540}
      alt={`Cover Image for ${title}`}
      className={cn("shadow-small sm:rounded-3xl", {
        "hover:shadow-medium transition-shadow duration-200": slug,
      })}
      src={imageBuilder(imageObject).width(1240).height(540).url()}
    />
  );

  return (
    <div className="-px-5 sm:px-0">
      {slug ? (
        <Link as={`/posts/${slug}`} href="/posts/[slug]">
          <a aria-label={title}>{image}</a>
        </Link>
      ) : (
        image
      )}
    </div>
  );
}
