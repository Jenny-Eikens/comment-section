import React from "react";
import CommentsList from "./CommentsList";

async function fetchComments() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    console.log("Fetching from URL:", baseUrl);
    // const res = await fetch(process.env.NODE_ENV === "development" ? `${baseUrl}/data.json` : process.env.NODE_ENV === "production" ? `${VERCEL_URL}/data.json`);
    const res = await fetch(`${baseUrl}/data.json`);
    const data = await res.json();
    if (!data || !data.comments || !data.currentUser) {
      throw new Error("Invalid data format");
    }
    return {
      comments: data.comments,
      currentUser: data.currentUser,
    };
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return {
      comments: [],
      currentUser: null,
    };
  }
}

const CommentsPage = async () => {
  const { comments, currentUser } = await fetchComments();

  if (!comments || !currentUser) {
    console.error("Missing required data:", { comments, currentUser });
    return <div>Error loading data</div>;
  }

  return <CommentsList comments={comments} currentUser={currentUser} />;
};

export default CommentsPage;
