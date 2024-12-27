import React from "react";
import CommentsList from "./CommentsList";

/* TO-DO:
  - understand implementation of dark mode

  ISSUES:
 - inspect hydration error
*/

async function fetchComments() {
  try {
    const baseUrl =
      process.env.NODE_ENV === "development" ? "http://localhost:3000" : ""; // in production, use relative path
    const res = await fetch(`${baseUrl}/data.json`);
    const data = await res.json();
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

  return <CommentsList comments={comments} currentUser={currentUser} />;
};

export default CommentsPage;
