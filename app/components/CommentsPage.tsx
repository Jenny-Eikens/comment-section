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
export interface ActiveComment {
  type: string;
  id: number;
}

const CommentsPage = () => {
  const [comments, setComments] = useState<Comment[]>(
    [],
  ); /* initialized to empty array */
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [activeComment, setActiveComment] = useState<ActiveComment | null>(
    null,
  );
  const [score, setScore] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");

  const generateId = () => Date.now() + Math.random();

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
        const updatedReplies = comment.replies.map((reply) =>
          reply.id === id ? { ...reply, content: newContent } : reply,
        );
        return { ...comment, replies: updatedReplies };
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

  const addReply = (parentId: number, newComment: string) => {
    const replyTo = (
      comments: Comment[],
      parentId: number,
    ): string | undefined => {
      for (const comment of comments) {
        if (comment.id === parentId) {
          console.log("Username:", comment.user.username);
          return comment.user.username;
        }
        if (comment.replies && comment.replies.length > 0) {
          const foundInReplies = replyTo(comment.replies, parentId);
          if (foundInReplies) {
            console.log("Found in replies:", foundInReplies);
            return foundInReplies;
          }
        }
      }
      return undefined;
    };
    if (!currentUser) return;
    const addedReply: Comment = {
      id: generateId(),
      content: newComment,
      createdAt: new Date().toISOString(),
      score: 0,
      replyingTo: replyTo(comments, parentId),
      user: currentUser,
      replies: [],
    };

    setComments((prevComments) =>
      prevComments.map((comment: Comment) =>
        comment.id === parentId
          ? { ...comment, replies: [...comment.replies, addedReply] }
          : comment,
      ),
    );
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

  const handleAddReply =
    (parentId: number) => (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (newComment.trim() === "")
        return; /* prevent submitting empty comment */

      addReply(parentId, newComment);
      setNewComment("");
      setActiveComment(null);
    };

  const handleAddComment: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return; /* prevent submitting empty comment */

    addComment(newComment);
    setNewComment("");
  };

  const handleEditComment = (id: number, newContent: string) => {
    setComments((prevComments) => editComment(prevComments, id, newContent));
  };

  return (
    <>
      <div className="content-wrapper w-[90vw] max-w-[700px] space-y-4">
        <div>Comments</div>
        {comments.map((comment: Comment) => (
          <div key={comment.id} className="space-y-4">
            <Comment
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              activeComment={activeComment}
              setActiveComment={setActiveComment}
              score={comment.score}
              setScore={setScore}
              deleteComment={deleteComment}
              editComment={handleEditComment}
              newComment={newComment}
              setNewComment={setNewComment}
              handleSubmit={handleAddReply(comment.id)}
            />

            {comment.replies?.map((reply: Comment) => (
              <div className="replies ml-4 space-y-4 md:ml-[4rem]">
                <Comment
                  key={reply.id}
                  comment={reply}
                  currentUser={currentUser}
                  activeComment={activeComment}
                  setActiveComment={setActiveComment}
                  score={reply.score}
                  setScore={setScore}
                  deleteComment={deleteComment}
                  editComment={handleEditComment}
                  newComment={newComment}
                  setNewComment={setNewComment}
                  handleSubmit={handleAddReply(reply.id)}
                />
              </div>
            ))}
          </div>
        ))}
        <CommentForm
          currentUser={currentUser}
          newComment={newComment}
          setNewComment={setNewComment}
          onSubmit={handleAddComment}
          submitLabel="SEND"
        />
      </div>
    </>
  );
};

export default CommentsPage;
