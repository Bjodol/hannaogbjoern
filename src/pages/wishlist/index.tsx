import Container from "../../../components/container";
import Header from "../../../components/header";
import { getWishes } from "../../../lib/api";
import markdownStyles from "../../../components/markdown-styles.module.css";
import { EmojiLabel } from "../../components/EmojiLabel";
import BlockContent from "@sanity/block-content-to-react";
import Image from "next/image";
import { imageBuilder } from "../../../lib/sanity";
import { useMemo, useState } from "react";
import axios, { AxiosResponse } from "axios";
import useSWR, { useSWRConfig } from "swr";
import { WishResource } from "../api/wish";
import cx from "classnames";

type Link = {
  _key: string;
  link: string;
  name: string;
};

type Slug = {
  _type: "slug";
  current: string;
};

type Media = {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
};

type Wish = {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: "wish";
  _updatedAt: string;
  count: number;
  description: any;
  image?: Media;
  links: Link[];
  slug: Slug;
  title: string;
};

const WishlistPage: React.FC<{ wishes: Wish[] }> = ({ wishes }) => {
  const [loading, setLoading] = useState(false);
  const { mutate } = useSWRConfig();
  const { data } = useSWR<AxiosResponse<WishResource[]>>(
    "/api/wish",
    axios.get
  );
  const wishlist = useMemo(
    () =>
      wishes
        .map((wish) => {
          const status =
            data?.data.find(({ id }) => id === wish._id)?.count ?? 0;
          const progress =
            status / wish.count === 1
              ? 100
              : Math.abs((status / wish.count) * 100);
          return {
            ...wish,
            progress,
            status,
          };
        })
        .sort((a, b) => a.slug.current.localeCompare(b.slug.current))
        .sort((a, b) => (b.progress - a.progress) * -1),
    [data, wishes]
  );
  return (
    <Container>
      <Header />
      <h1 className="text-2xl sm:text-6xl text-center mb-4">
        <EmojiLabel emoji="💝">
          <span className="pl-4">Ønskeliste</span>
        </EmojiLabel>
      </h1>
      <p>
        Vi har ikke opprettet noen ønskelister hos noen forhandlere. Derimot har
        vi en liste her (som vi lover å ikke sjekke statusen på 🤞), så man står
        fritt til å velge butikk etter eget ønske. Forhandlerne som er listet
        opp er bare forslag 😊. <br /> Det kan komme flere ønsker etter hvert
        som vi kommer på dem.
      </p>
      <ul className="max-w-[64rem] space-y-4 py-16">
        {wishlist.map(
          ({
            _id,
            title,
            description,
            image,
            links,
            count,
            progress,
            slug,
            status,
          }) => (
            <li
              key={_id}
              id={_id}
              className={cx(
                "sm:grid grid-cols-[200px_auto] gap-4 bg-white shadow-2xl rounded-lg",
                { "animate-pulse": loading }
              )}
            >
              <div className="flex justify-center">
                <Image
                  src={
                    image
                      ? imageBuilder(image).width(640).height(640).url()
                      : "/static/Ribbon.png"
                  }
                  width={640}
                  height={640}
                  className="rounded-tl-lg rounded-bl-lg"
                  objectFit="cover"
                  alt="wish-image"
                />
              </div>
              <div className="grid gap-2 p-4">
                <h2 className="text-lg font-[600]">{title}</h2>
                <BlockContent
                  blocks={description}
                  projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                  dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
                  className={markdownStyles.markdown}
                />
                <h3>Tilgjengelig hos:</h3>
                <ul className="pl-4">
                  {links.map(({ _key, link, name }) => (
                    <li key={_key}>
                      <a
                        href={link}
                        className="underline decoration-pink-600 decoration-2"
                      >
                        {name}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="grid gap-4 grid-cols-[auto_1fr] items-center">
                  <h3 className="text-lg">Status</h3>
                  <progress value={status} max={count} className="sr-only" />
                  <div className={`bg-gray-300 rounded-lg`}>
                    {!!progress ? (
                      <span
                        className={`flex items-center justify-center bg-pink-600 text-white text-bold rounded-lg px-4 py-2`}
                        style={{ width: `${progress}%` }}
                      >{`${status}/${count}`}</span>
                    ) : (
                      <span className="flex items-center justify-center px-4 py-2">{`${status}/${count}`}</span>
                    )}
                  </div>
                </div>
                {status !== count ? (
                  <button
                    disabled={loading}
                    onClick={async () => {
                      setLoading(true);
                      const fetcher = status === 0 ? axios.post : axios.put;
                      const response = await fetcher("/api/wish", {
                        id: _id,
                        slug: slug.current,
                        count: status + 1,
                      });
                      console.log({ response });
                      await mutate("/api/wish");
                      const element = document.getElementById(_id);
                      element.scrollIntoView({
                        behavior: "smooth",
                        block: "end",
                      });
                      setLoading(false);
                    }}
                    className="flex justify-center rounded-full w-full bg-pink-600 text-white px-4 py-2 font-bold sm:w-[fit-content] justify-self-end"
                  >
                    Marker en som kjøpt
                  </button>
                ) : (
                  <span className="flex justify-center w-full italic text-pink-600 px-4 py-2 font-bold sm:w-[fit-content] justify-self-end">
                    Alt er kjøpt
                  </span>
                )}
              </div>
            </li>
          )
        )}
      </ul>
    </Container>
  );
};

export async function getStaticProps({ params, preview = false }) {
  const data = await getWishes();
  return {
    props: {
      wishes: data,
    },
    revalidate: 1,
  };
}

export default WishlistPage;
