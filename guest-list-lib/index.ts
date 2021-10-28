import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const file = resolve(__dirname, "guest-list.csv");
console.log(file);

const data = readFileSync(file, "utf-8");
const lines = data.split(/\r?\n/);

const guestList = lines.reduce((acc, cur) => {
  const [invitationGroup, ...rest] = cur.split(",").filter((val) => !!val);
  const guests = rest.reduce(
    (acc, name) => [
      ...acc,
      {
        name,
        invitationGroup,
      },
    ],
    []
  );
  console.log(guests);
  return [...acc, ...guests];
}, []);

console.log(guestList);
writeFileSync("guest-list.json", JSON.stringify({ guestList }), "utf-8");
console.log("All done");
