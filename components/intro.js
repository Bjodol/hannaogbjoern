import Link from "next/link";
import { EmojiLabel } from "../src/components/EmojiLabel";

export default function Intro() {
  return (
    <>
      <section className="flex-col md:flex-row flex items-center md:justify-between py-16 md:pb-4 text-center sm:text-left">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
          <Link href="/">
            <a className="bg-clip-text text-transparent bg-gradient-to-tr from-green-900 to-pink-900 hover:text-green-900">
              Hanna + Bjørn = ❤️
            </a>
          </Link>
        </h1>
        <div className="space-y-4">
          <h4 className="text-center md:text-left text-lg md:pl-8">
            - 30. April 2022 gifter vi oss 💒
          </h4>
          <Link href="/guest-list">
            <a className="flex justify-center rounded-full w-full bg-pink-600 text-white p-4">
              Påmelding
            </a>
          </Link>
        </div>
      </section>
      <nav className="py-4">
        <ul>
          <li>
            <Link href="/wishlist">
              <a className="text-xl py-4">
                <EmojiLabel emoji="💝">
                  <span className="underline">
                    Ønskeliste (Tilgjenglig 15. Januar)
                  </span>
                </EmojiLabel>
              </a>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
