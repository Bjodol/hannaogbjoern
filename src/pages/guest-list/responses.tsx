import axios, { AxiosResponse } from "axios";
import { useMemo } from "react";
import useSWR from "swr";
import { GuestList } from "../api/rsvp";
import guestList from "./guest-list.json";

const ResponsePage: React.FC = () => {
  const { data, error } = useSWR<AxiosResponse<GuestList>>(
    "/api/rsvp",
    axios.get
  );
  const { sorted, missing, ...stats } = useMemo(
    () => ({
      sorted:
        data?.data.guestInfo.sort(
          (a, b) => (a.willAttend ? 1 : 0) - (b.willAttend ? 1 : 0)
        ) ?? [],
      attendes: data?.data.guestInfo.reduce(
        (acc, { willAttend }) => (willAttend ? acc + 1 : acc),
        0
      ),
      declined: data?.data.guestInfo.reduce(
        (acc, { willAttend }) => (!willAttend ? acc + 1 : acc),
        0
      ),
      diets: data?.data.guestInfo.reduce((acc, { diet }) => {
        if (acc[diet]) return { ...acc, [diet]: acc[diet] + 1 };
        return { ...acc, [diet]: 1 };
      }, {}),
      alcohol: data?.data.guestInfo.reduce(
        (acc, { alcohol }) => (alcohol ? acc + 1 : acc),
        0
      ),
      friday: data?.data.guestInfo.reduce(
        (acc, { friday }) => (friday ? acc + 1 : acc),
        0
      ),
      missing: guestList.guestList.filter(
        ({ name, invitationGroup }) =>
          !data?.data.guestInfo.some(
            (resp) =>
              resp.name === name && resp.invitationId === invitationGroup
          )
      ),
    }),
    [data]
  );
  if (error) return <div>failed to load</div>;
  if (!data) return <div>Loading</div>;
  return (
    <div className="p-16 w-full">
      <h1 className="text-6xl">Summary</h1>
      <ul>
        {Object.entries(stats).map(([key, value]) => {
          if (typeof value === "number")
            return <li key={key}>{`${key}: ${value}`}</li>;
          return (
            <li>
              {key}
              <ul className="pl-4">
                {Object.entries(value).map(([preference, count]) => (
                  <li key={preference}>{`${preference}: ${count}`}</li>
                ))}
              </ul>
            </li>
          );
        })}
        <li>Missing: {missing.length}</li>
      </ul>
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
          {missing.map(({ name, invitationGroup }) => (
            <tr key={`${name}-${invitationGroup}`}>
              <td className="p-4">Missing</td>
              <td className="p-4">{name}</td>
            </tr>
          ))}
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
