import { useMemo, useState } from "react";
import { formatNames } from "../../utils";
import { guestList } from "./guest-list.json";
import Link from "next/link";

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
    <form>
      <input
        placeholder="Navnet ditt"
        onChange={({ target: { value } }) => setFilter(value)}
        value={filter}
      />
      <ul>
        {Object.entries(groups).map(([id, names]) => (
          <li key={id}>
            <Link href={`/guest-list/${id}`}>{formatNames(names)}</Link>
          </li>
        ))}
      </ul>
    </form>
  );
};

export default GuestListPage;
