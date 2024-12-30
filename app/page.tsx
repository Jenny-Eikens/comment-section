import CommentsPage from "./components/CommentsPage";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Frontend Mentor | Interactive Comment Section",
  icons: {
    icon: "/favicon-32x32.png",
  },
  description: "Interactive comment section",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function Home() {
  return (
    <>
      <div className="m-auto flex min-h-[100vh] w-full flex-col items-center justify-center bg-base-100 p-3">
        <CommentsPage />
      </div>
    </>
  );
}
