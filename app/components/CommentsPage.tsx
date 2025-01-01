import React from "react";
import CommentsList from "./CommentsList";

async function fetchComments() {
  try {
    /* const baseUrl =
      process.env.NODE_ENV === "development" ? "http://localhost:3000" : ""; // in production, use relative path

    const url = new URL("/data.json", baseUrl); // Use the `URL` constructor to handle relative URLs
    const res = await fetch(url); */

    // const isDevelopment = process.env.NODE_ENV === "development";
    /* const res = await fetch(
      isDevelopment ? "http://localhost:3000/data.json" : "/data.json",
    ); */
    const res = await fetch("/data.json");
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
