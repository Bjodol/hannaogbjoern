import { useRouter } from "next/router";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { formatMultiple, formatNames, getChoiceText } from "../../../utils";
import Guests from "../guest-list.json";
import { EmojiLabel } from "../../../components/EmojiLabel";
import axios from "axios";
import useSWR from "swr";
import { GuestList } from "../../api/rsvp";
import cx from "classnames";
import Container from "../../../../components/container";
import Header from "../../../../components/header";

const animateHeight = (show: boolean, extras?: string) =>
  cx(
    { "max-h-96": show, "max-h-0": !show },
    "transition-all duration-700 overflow-hidden",
    extras
  );
const radioProps = { className: "sr-only", type: "radio" };
const getDefaultValue = (invitationId: string): GuestList => ({
  guestInfo: Guests.guestList
    .filter((guest) => guest.invitationGroup === invitationId)
    .map((guest) => ({
      diet: null,
      allergies: "",
      allergiesConfirmed: false,
      name: guest.name,
      alcohol: null,
      willAttend: null,
      friday: null,
      invitationId,
      createdAt: new Date().toISOString(),
    })),
});

const search = async (invitationId: string) => {
  try {
    const { data } = await axios.get<GuestList>(
      `/api/rsvp?invitationId=${invitationId}`
    );
    return data;
  } catch (e) {
    return getDefaultValue(invitationId);
  }
};

const InvitationRSVP: React.FC = () => {
  const {
    query: { invitationId },
    replace,
  } = useRouter();
  const { data, error } = useSWR(invitationId, search, {
    revalidateOnFocus: false,
  });

  const {
    control,
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GuestList>();
  const { fields } = useFieldArray({ control, name: "guestInfo" });

  useEffect(() => {
    reset(data);
  }, [reset, data]);
  console.log(watch("guestInfo"));

  if (error) return <div>Error</div>;
  if (!data) return null;
  return (
    <Container>
      <Header />
      <form
        className="space-y-4 sm:max-w-prose sm:mx-auto"
        onSubmit={handleSubmit(async ({ guestInfo }) => {
          const payload = guestInfo.map(
            ({ willAttend, alcohol, friday, ...rest }) => ({
              ...rest,
              friday: friday === "true",
              alcohol: alcohol === "true",
              willAttend: willAttend === "true",
            })
          );
          const fetcher = data.guestInfo.some((guest) => guest["_id"])
            ? axios.put
            : axios.post;
          const response = await fetcher("/api/rsvp", { guestInfo: payload });
          console.log(response);
          replace(`/guest-list/${invitationId}/success`);
        })}
      >
        <h1 className="sm:text-6xl">
          {`👋 Hei ${formatNames(data.guestInfo.map(({ name }) => name))}!`}
        </h1>
        <p className="px-4">{`Er ${formatMultiple(
          data.guestInfo
        )} ${formatMultiple(data.guestInfo, {
          single: "klar",
          multiple: "klare",
        })} til å delta på bryllupet? 🥰`}</p>
        {fields.map(({ id, name }, index) => {
          const {
            willAttend,
            diet,
            alcohol,
            allergies,
            allergiesConfirmed,
            friday,
          } = watch(`guestInfo.${index}`);
          return (
            <div key={id}>
              <div className="p-4 shadow-xl border rounded border-gray-400 bg-white">
                <h2
                  className={cx({ "font-bold": !willAttend })}
                >{`${name} er${getChoiceText(`${willAttend}`, {
                  true: " klar for å delta på bryllupsfesten 🕺",
                  false:
                    " dessverre ikke tilgjenglig til å delta i bryllupet 😢",
                  null: "... 🥁",
                })}`}</h2>

                <div className={animateHeight(willAttend === null)}>
                  <label className="block py-4 hover:bg-green-100">
                    <input
                      value="true"
                      {...radioProps}
                      {...register(`guestInfo.${index}.willAttend`, {
                        required: "Deltagelse må besvares",
                      })}
                    />
                    <EmojiLabel emoji={"🕺"}>
                      <span className="underline">
                        Klar for å delta på bryllupsfesten!
                      </span>
                    </EmojiLabel>
                  </label>
                  <label className="block py-4 hover:bg-red-300">
                    <input
                      value="false"
                      {...radioProps}
                      {...register(`guestInfo.${index}.willAttend`, {
                        required: "Deltagelse må besvares",
                      })}
                    />
                    <EmojiLabel emoji={"😢"}>
                      <span className="underline">
                        Dessverre ikke tilgjenglig til å delta i bryllupet.
                      </span>
                    </EmojiLabel>
                  </label>
                </div>
                {willAttend === "true" && (
                  <h2
                    className={cx({
                      "font-bold": willAttend === "true" && !diet,
                    })}
                  >{`og spiser${getChoiceText(diet, {
                    all: " ALT! 🍖",
                    vegan: " vegansk 🥕",
                    vegetarian: " vegetarisk 🧀",
                    pescetarian: " pescetarisk 🐟",
                    "all-pinapple": " ABSOLUTT ALT! 🍍🍕",
                    null: "... 🥁",
                  })}`}</h2>
                )}
                <div className={animateHeight(willAttend === "true" && !diet)}>
                  <label className="block py-4 hover:bg-green-100">
                    <input
                      value="all"
                      {...radioProps}
                      {...register(`guestInfo.${index}.diet`)}
                    />
                    <EmojiLabel emoji={"🍖"}>
                      <span className="underline">Alt.</span>
                    </EmojiLabel>
                  </label>
                  <label className="block py-4 hover:bg-green-100">
                    <input
                      value="pescetarian"
                      {...radioProps}
                      {...register(`guestInfo.${index}.diet`)}
                    />
                    <EmojiLabel emoji={"🐟"}>
                      <span className="underline">Pescetarisk</span>
                    </EmojiLabel>
                  </label>
                  <label className="block py-4 hover:bg-green-100">
                    <input
                      value="vegetarian"
                      {...radioProps}
                      {...register(`guestInfo.${index}.diet`)}
                    />
                    <EmojiLabel emoji={"🧀"}>
                      <span className="underline">Vegetarisk</span>
                    </EmojiLabel>
                  </label>
                  <label className="block py-4 hover:bg-green-100">
                    <input
                      value="vegan"
                      {...radioProps}
                      {...register(`guestInfo.${index}.diet`)}
                    />
                    <EmojiLabel emoji={"🥕"}>
                      <span className="underline">Vegansk</span>
                    </EmojiLabel>
                  </label>
                  <label className="block py-4 hover:bg-green-100">
                    <input
                      value="all-pinapple"
                      {...radioProps}
                      {...register(`guestInfo.${index}.diet`)}
                    />
                    <EmojiLabel emoji={"🍍"}>
                      <span className="underline">
                        ALT! INKLUDERT ANANAS PÅ PIZZA!!!
                      </span>
                    </EmojiLabel>
                  </label>
                </div>
                {!!diet && (
                  <h2
                    className={cx({ "font-bold": !!diet && !alcohol })}
                  >{`Vil gjerne drikke${getChoiceText(`${alcohol}`, {
                    true: " alkohol 🍺",
                    false: " alkoholfritt 🍎",
                    null: "... 🥁",
                  })}`}</h2>
                )}
                <div className={animateHeight(!!diet && !alcohol)}>
                  <label className="block py-4 hover:bg-green-100">
                    <input
                      value="true"
                      {...radioProps}
                      {...register(`guestInfo.${index}.alcohol`)}
                    />
                    <EmojiLabel emoji={"🍺"}>
                      <span className="underline">Alkohol</span>
                    </EmojiLabel>
                  </label>
                  <label className="block py-4 hover:bg-green-100">
                    <input
                      value="false"
                      {...radioProps}
                      {...register(`guestInfo.${index}.alcohol`)}
                    />
                    <EmojiLabel emoji={"🍎"}>
                      <span className="underline">Alkoholfritt</span>
                    </EmojiLabel>
                  </label>
                </div>
                {!!alcohol && (
                  <h2
                    className={cx({
                      "font-bold": !!alcohol && !allergiesConfirmed,
                    })}
                  >{`${
                    !!allergiesConfirmed
                      ? ` ${
                          !!allergies
                            ? `Er allergisk mot ${allergies}`
                            : "Har ingen allergier"
                        }`
                      : "Er allergisk mot... ❓"
                  }`}</h2>
                )}
                <div
                  className={animateHeight(
                    !!alcohol && !allergiesConfirmed,
                    "flex w-full"
                  )}
                >
                  <label className="block flex-grow">
                    <input
                      type="text"
                      className="w-full p-4 border rounded"
                      placeholder="Allergier"
                      {...register(`guestInfo.${index}.allergies`)}
                    />
                  </label>
                  <label className="bg-green-100 p-4 rounded hover:bg-green-400">
                    Bekreft
                    <input
                      type="checkbox"
                      className="sr-only"
                      {...register(`guestInfo.${index}.allergiesConfirmed`)}
                    />
                  </label>
                </div>
                {!!allergiesConfirmed && (
                  <h2
                    className={cx({
                      "font-bold": !!allergiesConfirmed && !friday,
                    })}
                  >{`${name} ${getChoiceText(`${friday}`, {
                    true: " deltar på pizza-minglingen fredagen 🍕",
                    false: " deltar kun på bryllupsfesten 🙂",
                    null: "... ⁉️",
                  })}`}</h2>
                )}
                <div className={animateHeight(!!allergiesConfirmed && !friday)}>
                  <label className="block py-4 hover:bg-green-100">
                    <input
                      value="true"
                      {...radioProps}
                      {...register(`guestInfo.${index}.friday`)}
                    />
                    <EmojiLabel emoji={"🍕"}>
                      <span className="underline">
                        Vil være med på pizza-mingling fredagen
                      </span>
                    </EmojiLabel>
                  </label>
                  <label className="block py-4 hover:bg-red-300">
                    <input
                      value="false"
                      {...radioProps}
                      {...register(`guestInfo.${index}.friday`)}
                    />
                    <EmojiLabel emoji={"🙂"}>
                      <span className="underline">
                        Ønsker ikke å være med på fredagen.
                      </span>
                    </EmojiLabel>
                  </label>
                </div>
              </div>
            </div>
          );
        })}
        {Object.keys(errors).length > 0 && errors.guestInfo.length > 0 && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            <p>
              <strong>Må besvares:</strong>
            </p>
            <ul>
              {errors.guestInfo.map((error) =>
                Object.entries(error).map(([key, value]) => (
                  <li key={key}>{value.message}</li>
                ))
              )}
            </ul>
          </div>
        )}
        <button
          type="submit"
          className="bg-green-400 w-full rounded p-4 border shadow-xl"
        >
          ✉️ Send inn
        </button>
        <button
          type="reset"
          onClick={() => reset(getDefaultValue(invitationId as string))}
          className="w-full p-4"
        >
          ❌ Start på nytt
        </button>
      </form>
    </Container>
  );
};

export default InvitationRSVP;
