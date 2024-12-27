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
      <div className="m-auto flex min-h-[100vh] w-full flex-col items-center justify-center bg-base-100 p-3">
        <CommentsPage />
      </div>
    </>
  );
}
