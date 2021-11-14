import "tailwindcss/tailwind.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  console.log("Jasså ja...");
  console.log("Så du ser etter easter eggs i konsollen?");
  console.log("Vel jeg får gi deg ett da:");
  console.log("https://hannaogbjoern.vercel.app/secret-dev-experience");
  return (
    <div className="bg-gradient-to-tr from-green-100 to-pink-100 min-h-screen">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
