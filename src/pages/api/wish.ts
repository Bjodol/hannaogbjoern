// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { Schema } from "jsonschema";
import { WithId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSearchParams } from "../../api-utils";
import { getDBResourceClient } from "../../db-client";
import { SchemaValidationError } from "../../errors";

export const schema: Schema = {
  id: "GuestInfo",
  required: ["id", "count", "createdAt"],
  properties: {
    createdAt: {
      type: "string",
      pattern:
        /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,
      description: "must be an ISO date-time string",
    },
    id: {
      type: "string",
      description: "must be a string and is required",
    },
    count: {
      type: "number",
      description: "must be a number and is required",
    },
  },
};

export const collectionName = "wish";
export const { list, create, update } = getDBResourceClient<
  WishResource & MetaInfo
>({
  collectionName,
  limit: 300,
  schema,
});

export type WishResource = {
  count: number;
  id: string;
  slug: string;
};

export type MetaInfo = {
  createdAt: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body,
    method,
    headers: { host },
    url,
  } = req;
  try {
    switch (method.toUpperCase()) {
      case "GET": {
        const data = await list(getSearchParams({ host, url, schema }));
        res.status(200).json(data);
        break;
      }
      case "POST": {
        const { id, count, slug }: WishResource = body;
        const data = await create({
          id,
          count,
          slug,
          createdAt: new Date().toISOString(),
        });
        res.status(200).json(data);
        break;
      }
      case "PUT": {
        const { id, ...rest }: WithId<WishResource> = body;
        const data = await update(
          { id },
          { id, ...rest, createdAt: new Date().toISOString() }
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
