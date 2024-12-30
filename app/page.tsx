import CommentsPage from "./components/CommentsPage";
import Head from "next/head";

export const metadata = {
  title: "Frontend Mentor | Interactive Comment Section",
  icons: {
    icon: "/favicon-32x32.png",
  },
  description: "Interactive comment section",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function Home() {
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href={metadata.icons.icon} />
        <meta
          name="viewport"
          content={`width=${viewport.width}, initial-scale=${viewport.initialScale}`}
        />
      </Head>
      <div className="m-auto flex min-h-[100vh] w-full flex-col items-center justify-center bg-base-100 p-3">
        <CommentsPage />
      </div>
    </>
  );
}
