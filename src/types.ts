import { ObjectId } from "bson";

export type StripObjectId<R> = {
  [K in keyof R]: R[K] extends ObjectId | ObjectId[] ? any : R[K];
};
