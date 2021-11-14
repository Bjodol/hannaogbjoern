import axios, { AxiosResponse } from "axios";
import { useMemo } from "react";
import useSWR from "swr";
import { GuestList } from "../api/rsvp";

const ResponsePage: React.FC = () => {
  const { data, error } = useSWR<AxiosResponse<GuestList>>(
    "/api/rsvp",
    axios.get
  );
  const sorted = useMemo(
    () =>
      data?.data.guestInfo.sort(
        (a, b) => (a.willAttend ? 1 : 0) - (b.willAttend ? 1 : 0)
      ) ?? [],
    [data]
  );
  if (error) return <div>failed to load</div>;
  if (!data) return <div>Loading</div>;
  return (
    <div className="p-16">
      <h1 className="text-6xl">Gjesteliste</h1>
      <table className="border-seperate">
        <thead>
          <tr>
            <th className="p-4">Kommer</th>
            <th className="p-4">Navn</th>
            <th className="p-4">Diett</th>
            <th className="p-4">Allergier</th>
            <th className="p-4">Alkohol</th>
            <th className="p-4">Deltar på fredag</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(
            ({ name, willAttend, diet, allergies, alcohol, friday }) => (
              <tr key={name}>
                <td className="p-4">{willAttend ? "Ja" : "Nei"}</td>
                <td className="p-4">{name}</td>
                <td className="p-4">{diet}</td>
                <td className="p-4">{allergies}</td>
                <td className="p-4">{alcohol ? "Ja" : "Nei"}</td>
                <td className="p-4">{friday ? "Ja" : "Nei"}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ResponsePage;
