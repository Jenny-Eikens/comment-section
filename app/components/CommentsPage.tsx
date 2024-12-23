import React from "react";
import CommentsList from "./CommentsList";

{
  /* TO-DO:
  - figure out how to update data.json (send changed data to backend) -> optional
  - implement localStorage
  - do I still need the newComment variable? What does it even do??
  - why do issues with textarea and button in CommentForm arise (see browser dev tools -> inspect DOM)?
*/
}

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
