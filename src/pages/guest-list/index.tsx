import { useMemo, useState } from "react";
import { formatNames } from "../../utils";
import { guestList } from "./guest-list.json";
import Link from "next/link";
import { EmojiLabel } from "../../components/EmojiLabel";
import PostTitle from "../../../components/post-title";

const GuestListPage: React.FC = () => {
  const [filter, setFilter] = useState("");

  const groups = useMemo<{ [group: string]: string[] }>(() => {
    const groupMatches = guestList
      .filter(({ name }) => name.toLowerCase().includes(filter.toLowerCase()))
      .map(({ invitationGroup }) => invitationGroup);
    if (groupMatches.length > 4) return {};
    return groupMatches.reduce(
      (acc, group) => ({
        ...acc,
        [group]: guestList
          .filter(({ invitationGroup }) => invitationGroup === group)
          .map(({ name }) => name),
      }),
      {}
    );
  }, [filter]);

  return (
    <div>
      <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center  pt-8">
        <span className="bg-clip-text text-transparent bg-gradient-to-tr from-green-900 to-pink-900">
          Finn din invitasjon 🔍
        </span>
      </h1>
      <form className="mx-auto max-w-prose text-center p-4">
        <label>
          <span className="text-3xl"></span>
          <input
            placeholder="Navnet ditt"
            onChange={({ target: { value } }) => setFilter(value)}
            value={filter}
            className="p-4 rounded block mt-4 w-full focus:ring-4 ring-pink-400 focus:outline-none"
          />
        </label>
        <ul className="space-y-2 mt-4">
          {Object.entries(groups).map(([id, names]) => (
            <li
              key={id}
              className="group bg-white shadow-md hover:ring-4 ring-pink-400 relative h-32"
            >
              <Link href={`/guest-list/${id}`}>
                <a className="flex p-4 text-3xl pt-8 h-full">
                  <EmojiLabel
                    emoji="💌"
                    className="group-hover:opacity-100 opacity-0 transition-opacity mr-2 hidden sm:block"
                  />
                  {formatNames(names)}
                  <span className="absolute top-0 right-0 mt-1 mr-1">💟</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
};

export default GuestListPage;
