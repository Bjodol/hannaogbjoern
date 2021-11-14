import axios from "axios";
import confetti from "canvas-confetti";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";
import Link from "next/link";
import { formatMultiple, formatNames } from "../../../utils";
import { GuestList } from "../../api/rsvp";

const getRSVP = async (invitationId: string) => {
  const { data } = await axios.get<GuestList>(invitationId);
  return data;
};

const Success: React.FC = () => {
  const {
    query: { invitationId },
  } = useRouter();
  const { data, error } = useSWR(
    `/api/rsvp?invitationId=${invitationId}`,
    getRSVP
  );
  const attendees =
    data?.guestInfo
      .filter(({ willAttend }) => willAttend)
      .map((guest) => guest.name) ?? [];
  useEffect(() => {
    const interval = setInterval(() => {
      if (attendees.length > 0) {
        const x = Math.random();
        const angle = Math.random() * 60;
        confetti({
          particleCount: 150,
          angle: x >= 0.5 ? angle + 60 : angle,
          spread: 360,
          origin: { x, y: Math.random() - 0.2 },
        });
      }
    }, 700);
    return () => clearInterval(interval);
  }, [attendees]);
  return (
    <div className="flex items-center min-h-screen justify-center flex-wrap">
      <h1 className="text-3xl lg:text-9xl sm:text-6xl text-center p-16 leading-relaxed">
        {attendees.length > 0 && (
          <span>
            🎉 🎉 🎉 <br />
            {`Vi gleder oss til å se ${formatMultiple(attendees, {
              single: "deg",
              multiple: "dere",
            })}, ${formatNames(attendees)}`}
            <br />
            🎉 🎉 🎉
          </span>
        )}
        {data && attendees.length === 0 && (
          <span>
            😢 <br />
            {`Det var synd ${formatNames(
              data.guestInfo.map(({ name }) => name)
            )}`}
          </span>
        )}
      </h1>
      {data && (
        <Link href="/">
          <a className="w-full flex justify-center underline">Til forsiden</a>
        </Link>
      )}
    </div>
  );
};

export default Success;
