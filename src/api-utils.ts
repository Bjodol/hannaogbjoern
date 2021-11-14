import axios, { AxiosResponse } from "axios";
import { ObjectId } from "bson";
import { Schema, ValidationError } from "jsonschema";
import { SchemaValidationError } from "./errors";
import { StripObjectId } from "./types";

export const getSearchString = <DataObject extends Record<string, string>>(
  search?: Partial<DataObject>
): string | undefined =>
  search ? new URLSearchParams(search).toString() : undefined;

export const getSearchParams = <R>({
  host,
  url,
  schema,
}: {
  host: string;
  url: string;
  schema: Schema;
}): Partial<R> => {
  const { search } = new URL(`${host}${url}`);
  const filters = Array.from(new URLSearchParams(search).entries());
  if (filters.length > 0) {
    const keys = Object.keys(schema.properties);
    const { query, errors } = filters.reduce(
      (acc, [key, value]) => {
        if (!keys.some((model) => model === key))
          return {
            ...acc,
            errors: [
              ...acc.errors,
              new ValidationError(
                `${key} does not exists on schema ${schema.id}`,
                undefined,
                schema,
                key
              ),
            ],
          };
        return { ...acc, query: { ...acc.query, [key]: value } };
      },
      { query: {} as Partial<R>, errors: [] as ValidationError[] }
    );
    if (errors.length > 0) throw new SchemaValidationError(errors);
    return query;
  }
  throw new Error("No filters");
};

export const getResourceId = (params?: string | string[]): ObjectId | null => {
  if (!params) return null;
  const string = (typeof params !== "string"
    ? params.join()
    : params) as unknown as ObjectId;
  return ObjectId.isValid(string) ? string : null;
};

export const getApi = <DataObject>(url: string): APIRest<DataObject> => ({
  post: (body) => axios.post(`${url}/new`, body),
  patch: (id, body) => axios.patch(`${url}/${id}`, body),
  put: (id, body) => axios.put(`${url}/${id}`, body),
  get: (id) => axios.get(`${url}/${id}`),
  list: (search) => axios.get(`${url}/list${search ? `?${search}` : ""}`),
});

export type APIRest<G> = {
  post: (body: StripObjectId<Partial<G>>) => Promise<AxiosResponse<Partial<G>>>;
  patch: (
    id: string,
    body: StripObjectId<Partial<G>>
  ) => Promise<AxiosResponse<Partial<G>>>;
  put: (
    id: string,
    body: StripObjectId<Partial<G>>
  ) => Promise<AxiosResponse<Partial<G>>>;
  get: (id: string) => Promise<AxiosResponse<G>>;
  list: (search?: string) => Promise<AxiosResponse<G[]>>;
};
