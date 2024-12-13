"use client";
import React, { useEffect, useState } from "react";
import Comment from "./Comment";
import CommentForm from "./CommentForm";

const CommentsPage = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch("/data.json");
        if (!res.ok) throw new Error("Failed to fetch comments");
        const data = await res.json();
        setComments(data.comments);
      } catch (error) {
        console.log(error);
      }
    };
    fetchComments();
  }, []);

  return (
    <>
      <div className="content-wrapper w-[90vw] max-w-[700px] space-y-4">
        <div>Comments</div>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
        <CommentForm />
      </div>
    </>
  );
};

export default CommentsPage;
