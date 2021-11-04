import "tailwindcss/tailwind.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="bg-gradient-to-br from-green-100 to-pink-100 min-h-screen">
      <Component {...pageProps} />;
    </div>
  );
}

export default MyApp;
