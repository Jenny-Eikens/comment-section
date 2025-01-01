import React from "react";
import CommentsList from "./CommentsList";
import fs from "fs";
import path from "path";

async function fetchComments() {
  try {
    const filePath = path.join(process.cwd(), "public", "data.json");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContent);
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
