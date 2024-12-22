import React from "react";
import CommentsList from "./CommentsList";

{
  /* TO-DO:
  - figure out how to update data.json (send changed data to backend)
  - add hover states
  - implement localStorage
  - fix time stamp
  - don't wrap button text in spans in Comment component
  - limit nesting level (replying to replies)

  ISSUES:
  - comment.replyingTo gets inserted a second time when editing a comment
  - setting relative time doesn't work when I only try to apply it to new comments/replies
  
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
