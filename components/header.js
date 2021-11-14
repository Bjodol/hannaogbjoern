import Link from "next/link";

export default function Header() {
  return (
    <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-8 sm:mb-20 pt-8">
      <span className="bg-clip-text text-transparent bg-gradient-to-tr from-green-900 to-pink-900 hover:text-current">
        <Link href="/">
          <a>Hanna + Bjørn = ❤️</a>
        </Link>
      </span>
    </h2>
  );
}
