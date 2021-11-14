// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { Schema } from "jsonschema";
import { WithId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSearchParams } from "../../api-utils";
import { getDBResourceClient } from "../../db-client";
import { SchemaValidationError } from "../../errors";

const nullable = (schema: Schema): Pick<Schema, "anyOf"> => ({
  anyOf: [schema, { type: "null" }],
});

export const schema: Schema = {
  id: "GuestInfo",
  required: [
    "willAttend",
    "diet",
    "name",
    "allergies",
    "alcohol",
    "friday",
    "createdAt",
    "invitationId",
  ],
  properties: {
    createdAt: {
      type: "string",
      pattern:
        /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,
      description: "must be an ISO date-time string",
    },
    name: {
      type: "string",
      description: "must be a string and is required",
    },
    willAttend: {
      type: "boolean",
      description: "must be a boolean and is required",
    },
    invitationId: {
      type: "string",
      description: "must be a string and is required",
    },
    diet: nullable({
      type: "string",
      description: "must be a string and is required",
    }),
    allergies: nullable({
      type: "string",
      description: "must be a string and is required",
    }),
    alcohol: nullable({
      type: "boolean",
      description: "must be a boolean and is required",
    }),
    friday: nullable({
      type: "boolean",
      description: "must be a boolean and is required",
    }),
  },
};

export const collectionName = "guests";
export const { list, create, update } = getDBResourceClient<
  GuestData & MetaInfo
>({
  collectionName,
  limit: 100,
  schema,
});

export type GuestData =
  | {
      diet:
        | "all"
        | "vegan"
        | "vegetarian"
        | "pescetarian"
        | "all-pinapple"
        | "not-joining";
      allergies: string;
      allergiesConfirmed: boolean;
      name: string;
      invitationId: string;
      willAttend: "true";
      alcohol: "false" | "true";
      friday: "false" | "true";
    }
  | {
      willAttend: "false";
      name: string;
      allergiesConfirmed: boolean;
      diet: null;
      invitationId: string;
      allergies: null;
      alcohol: null;
      friday: null;
    };

export type MetaInfo = {
  createdAt: string;
};

export type GuestList = {
  guestInfo: GuestData[];
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body,
    method,
    headers: { host },
    url,
  } = req;
  console.log({ host, url });
  try {
    switch (method.toUpperCase()) {
      case "GET": {
        const data = await list(getSearchParams({ host, url, schema }));
        if (data.length === 0) {
          res.status(404).end();
          break;
        }
        res.status(200).json({ guestInfo: data });
        break;
      }
      case "POST": {
        const { guestInfo }: GuestList = body;
        const data = await Promise.all(
          guestInfo.map((guest) =>
            create({ ...guest, createdAt: new Date().toISOString() })
          )
        );
        res.status(200).json(data);
        break;
      }
      case "PUT": {
        const { guestInfo }: GuestList = body;
        const data = await Promise.all(
          guestInfo.map(
            ({ invitationId, name, _id, ...guest }: WithId<GuestData>) =>
              update({ invitationId, name }, { ...guest, invitationId, name })
          )
        );
        res.status(200).json(data);
        break;
      }
      default: {
        res.status(400).json({ message: "Method not found" });
        break;
      }
    }
  } catch (e) {
    if (e instanceof SchemaValidationError) {
      res.status(400).json(e.errors);
    } else {
      console.error(e);
      res.status(500).json(JSON.stringify(e));
    }
  }
};

export default handler;
