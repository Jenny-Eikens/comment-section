import CommentsPage from "./components/CommentsPage";

export const metadata = {
  title: "Frontend Mentor | Interactive Comment Section",
  icons: {
    icon: "/favicon-32x32.png",
  },
};

export default function Home() {
  return (
    <>
      <main className="m-auto flex min-h-[100vh] w-full items-center justify-center bg-v-light-gray p-3">
        <CommentsPage />
      </main>
    </>
  );
}
