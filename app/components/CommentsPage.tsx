"use client";
import React, { useEffect, useState } from "react";
import Comment from "./Comment";
import CommentForm from "./CommentForm";

{
  /* TO-DO:
  - understand editing comments
  - figure out how to update data.json (send changed data to backend)
*/
}

export interface CurrentUser {
  image: { png: string; webp: string };
  username: string;
}

const CommentsPage = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch("/data.json");
        if (!res.ok) throw new Error("Failed to fetch comments");
        const data = await res.json();
        setComments(data.comments);
        setCurrentUser(data.currentUser);
      } catch (error) {
        console.log(error);
      }
    };
    fetchComments();
  }, []);

  const editComment = (
    comments: Comment[],
    id: number,
    newContent: string,
  ): Comment[] => {
    {
      /* Note to self: have this explained to you */
    }
    return comments.map((comment) => {
      if (comment.id === id) {
        return {
          ...comment,
          content: newContent,
        };
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: editComment(comment.replies, id, newContent),
        };
      }
      return comment;
    });
  };

  const deleteComment = (id: number): void => {
    const removeComment = (comments: Comment[]): Comment[] => {
      return comments
        .filter((comment) => comment.id !== id)
        .map((comment) => {
          if (comment.replies) {
            return {
              ...comment,
              replies: removeComment(comment.replies),
            };
          }
          return comment;
        });
    };
    const updatedComments = removeComment(comments);
    setComments(updatedComments);
  };

  return (
    <>
      <div className="content-wrapper w-[90vw] max-w-[700px] space-y-4">
        <div>Comments</div>
        {comments.map((comment: Comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            currentUser={currentUser}
            deleteComment={deleteComment}
            editComment={(id: number, newContent: string) =>
              setComments((prevComments) =>
                editComment(prevComments, id, newContent),
              )
            }
          />
        ))}
        <CommentForm />
      </div>
    </>
  );
};

export default CommentsPage;
