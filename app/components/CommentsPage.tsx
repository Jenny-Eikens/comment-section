"use client";
import React, { useEffect, useState } from "react";
import Comment from "./Comment";
import CommentForm from "./CommentForm";

{
  /* TO-DO:
  - figure out how to handle submission of new comment / new reply
  - figure out how to update data.json (send changed data to backend)
*/
}

export interface CurrentUser {
  image: { png: string; webp: string };
  username: string;
}

const CommentsPage = () => {
  const [comments, setComments] = useState<Comment[]>(
    [],
  ); /* initialized to empty array */
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [newComment, setNewComment] = useState("");

  let idCounter = comments.length;
  const generateId = () => idCounter++;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch("/data.json");
        if (!res.ok) throw new Error("Failed to fetch comments");
        const data = await res.json();
        setComments(data.comments); /* set to data retrieved from backend */
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
    /* : Comment[] specifies function's return type */
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
          /* recursion, function gets called on replies array instead of comments array */
          /* comments now refers to comment.replies */
        };
      }
      return comment;
    });
  }; /* not setting the comments' state directly in this function keeps it reusable and not tied to specific state */

  const deleteComment = (id: number): void => {
    const removeComment = (comments: Comment[]): Comment[] => {
      return comments
        .filter((comment) => comment.id !== id)
        .map((comment) => {
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: removeComment(comment.replies) /* recursion */,
            };
          }
          return comment;
        });
    };
    const updatedComments = removeComment(comments);
    setComments(updatedComments);
  };

  const addComment = (newComment: string) => {
    if (!currentUser) return;
    const addedComment: Comment = {
      id: generateId(),
      content: newComment,
      createdAt: new Date().toISOString(),
      score: 0,
      user: currentUser,
      replies: [],
    };

    setComments((prevComments) => [...prevComments, addedComment]);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return; /* prevent submitting empty comment */

    addComment(newComment);
    setNewComment("");
  };

  const handleReply = () => {};

  return (
    <>
      <div className="content-wrapper w-[90vw] max-w-[700px] space-y-4">
        <div>Comments</div>
        {comments.map((comment: Comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            currentUser={currentUser}
            score={comment.score}
            setScore={setScore}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            isReplying={isReplying}
            setIsReplying={setIsReplying}
            deleteComment={deleteComment}
            editComment={
              (id: number, newContent: string) =>
                setComments(
                  (
                    prevComments /* prevComments represents current state value, name could be anything */,
                  ) => editComment(prevComments, id, newContent),
                ) /* calling setComments is necessary because editComment alone doesn't update comments variable */
            } /* only passing editComment={editComment} wouldn't allow child component access to setComments or parent's state */
            newComment={newComment}
            setNewComment={setNewComment}
            handleSubmit={handleSubmit}
            onReply={handleReply}
          />
        ))}
        <CommentForm
          currentUser={currentUser}
          newComment={newComment}
          setNewComment={setNewComment}
          onSubmit={handleSubmit}
          submitLabel="SEND"
        />
      </div>
    </>
  );
};

export default CommentsPage;
