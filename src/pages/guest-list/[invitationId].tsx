import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { formatMultiple, formatNames, getChoiceText } from "../../utils";
import { guestList } from "./guest-list.json";
import { EmojiLabel } from "../../components/EmojiLabel";
import error from "next/error";

type GuestData =
  | {
      diet: "all" | "vegan" | "vegetarian" | "pescetarian" | "all-pinapple";
      allergies: string;
      allergiesConfirmed: boolean;
      name: string;
      willAttend: "true";
      alcohol: "false" | "true";
      friday: "false" | "true";
    }
  | {
      willAttend: "false";
      name: string;
      allergiesConfirmed: boolean;
      diet: null;
      allergies: null;
      alcohol: null;
      friday: null;
    };

const radioProps = { className: "sr-only", type: "radio" };

const InvitationRSVP: React.FC = () => {
  const {
    query: { invitationId },
  } = useRouter();
  const defaultValues = useMemo(
    () => ({
      guestInfo: guestList
        .filter((guest) => guest.invitationGroup === invitationId)
        .map((guest) => ({
          diet: null,
          allergies: "",
          name: guest.name,
          alcohol: null,
          willAttend: null,
          friday: null,
        })),
    }),
    [invitationId]
  );

  const {
    control,
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    guestInfo: GuestData[];
  }>();
  const { fields } = useFieldArray({ control, name: "guestInfo" });

  useEffect(() => {
    reset(defaultValues);
  }, [reset, invitationId]);

  console.log(watch("guestInfo"));

  return (
    <form
      className="p-4 space-y-4 sm:w-fit-content"
      onSubmit={handleSubmit((data) => {
        alert(JSON.stringify(data, null, 2));
      })}
    >
      <h1>
        {`👋 Hei ${formatNames(
          defaultValues.guestInfo.map(({ name }) => name)
        )}!`}
      </h1>
      <p>{`Er ${formatMultiple(defaultValues.guestInfo)} ${formatMultiple(
        defaultValues.guestInfo,
        { single: "klar", multiple: "klare" }
      )} til å delta på bryllupet?`}</p>
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
            <div className="p-4 shadow-xl border rounded border-gray-400 bg-white transition-all duration-500">
              <h2>{`${name} er${getChoiceText(`${willAttend}`, {
                true: " klar for å delta på bryllupsfesten 🕺",
                false: " dessverre ikke tilgjenglig til å delta i bryllupet 😢",
                null: "... 🥁",
              })}`}</h2>
              {willAttend === null && (
                <>
                  <label className="block p-4 hover:bg-green-100">
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
                  <label className="block p-4 hover:bg-red-300">
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
                </>
              )}
              {willAttend === "true" && (
                <h2>{`og spiser${getChoiceText(diet, {
                  all: " ALT! 🍖",
                  vegan: " vegansk 🥕",
                  vegetarian: " vegetarisk 🧀",
                  pescetarian: " pescetarisk 🐟",
                  "all-pinapple": " ABSOLUTT ALT! 🍍🍕",
                  null: "... 🥁",
                })}`}</h2>
              )}
              {willAttend === "true" && !diet && (
                <>
                  <label className="block p-4 hover:bg-green-100">
                    <input
                      value="all"
                      {...radioProps}
                      {...register(`guestInfo.${index}.diet`)}
                    />
                    <EmojiLabel emoji={"🍖"}>
                      <span className="underline">Alt.</span>
                    </EmojiLabel>
                  </label>
                  <label className="block p-4 hover:bg-green-100">
                    <input
                      value="pescetarian"
                      {...radioProps}
                      {...register(`guestInfo.${index}.diet`)}
                    />
                    <EmojiLabel emoji={"🐟"}>
                      <span className="underline">Pescetarisk</span>
                    </EmojiLabel>
                  </label>
                  <label className="block p-4 hover:bg-green-100">
                    <input
                      value="vegetarian"
                      {...radioProps}
                      {...register(`guestInfo.${index}.diet`)}
                    />
                    <EmojiLabel emoji={"🧀"}>
                      <span className="underline">Vegetarisk</span>
                    </EmojiLabel>
                  </label>
                  <label className="block p-4 hover:bg-green-100">
                    <input
                      value="vegan"
                      {...radioProps}
                      {...register(`guestInfo.${index}.diet`)}
                    />
                    <EmojiLabel emoji={"🥕"}>
                      <span className="underline">Vegansk</span>
                    </EmojiLabel>
                  </label>
                  <label className="block p-4 hover:bg-green-100">
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
                </>
              )}
              {!!diet && (
                <h2>{`Vil gjerne drikke${getChoiceText(`${alcohol}`, {
                  true: " alkohol 🍺",
                  false: " alkoholfritt 🍎",
                  null: "... 🥁",
                })}`}</h2>
              )}
              {!!diet && !alcohol && (
                <>
                  <label className="block p-4 hover:bg-green-100">
                    <input
                      value="true"
                      {...radioProps}
                      {...register(`guestInfo.${index}.alcohol`)}
                    />
                    <EmojiLabel emoji={"🍺"}>
                      <span className="underline">Alkohol</span>
                    </EmojiLabel>
                  </label>
                  <label className="block p-4 hover:bg-green-100">
                    <input
                      value="false"
                      {...radioProps}
                      {...register(`guestInfo.${index}.alcohol`)}
                    />
                    <EmojiLabel emoji={"🍎"}>
                      <span className="underline">Alkoholfritt</span>
                    </EmojiLabel>
                  </label>
                </>
              )}
              {!!alcohol && (
                <h2>{`${
                  !!allergiesConfirmed
                    ? ` ${
                        !!allergies
                          ? `Er allergisk mot ${allergies}`
                          : "Har ingen allergier"
                      }`
                    : "Er allergisk mot... ❓"
                }`}</h2>
              )}
              {!!alcohol && !allergiesConfirmed && (
                <div className="flex w-full">
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
              )}
              {!!allergiesConfirmed && (
                <h2>{`${name} ${getChoiceText(`${friday}`, {
                  true: " deltar på pizza-minglingen fredagen 🍕",
                  false: " deltar kun på bryllupsfesten 🙂",
                  null: "... ⁉️",
                })}`}</h2>
              )}
              {!!allergiesConfirmed && !friday && (
                <>
                  <label className="block p-4 hover:bg-green-100">
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
                  <label className="block p-4 hover:bg-red-300">
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
                </>
              )}
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
        onClick={() => reset(defaultValues)}
        className="w-full p-4"
      >
        ❌ Start på nytt
      </button>
    </form>
  );
};

export default InvitationRSVP;
