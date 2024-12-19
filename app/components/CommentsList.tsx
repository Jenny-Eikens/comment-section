"use client";
import { useState } from "react";
import Comment from "./Comment";
import { CommentProps } from "./Comment";
import CommentForm from "./CommentForm";

export interface CurrentUser {
  image: { png: string; webp: string };
  username: string;
}

export interface ActiveComment {
  type: string;
  id: number;
}

export interface CommentsListProps {
  comments: CommentProps[];
  currentUser: CurrentUser | null;
}

const CommentsList = ({ comments, currentUser }: CommentsListProps) => {
  const [commentsList, setCommentsList] = useState(comments);
  const [activeComment, setActiveComment] = useState<ActiveComment | null>(
    null,
  );
  const [score, setScore] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");

  const generateId = () => Date.now() + Math.random();

  /* EDITING */

  const editComment = (
    commentsList: CommentProps[],
    id: number,
    newContent: string,
  ): CommentProps[] => {
    /* : Comment[] specifies function's return type */
    return commentsList.map((comment) => {
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

  const handleEditComment = (id: number, newContent: string) => {
    setCommentsList((prevComments) =>
      editComment(prevComments, id, newContent),
    );
  };

  /* DELETING */

  const deleteComment = (id: number): void => {
    const removeComment = (commentsList: CommentProps[]): CommentProps[] => {
      return commentsList
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
    const updatedComments = removeComment(commentsList);
    setCommentsList(updatedComments);
  };

  /* REPLYING */

  const replyingTo = (
    commentsList: CommentProps[],
    parentId: number,
  ): string | undefined => {
    for (const comment of commentsList) {
      if (comment.id === parentId) {
        return comment.user.username;
      }
      if (comment.replies && comment.replies.length > 0) {
        const foundInReplies = replyingTo(
          comment.replies,
          parentId,
        ); /* recursion, comment of commentsList now refers to reply of replies */
        if (foundInReplies) {
          return foundInReplies;
        }
      }
    }
    return undefined;
  };

  const addReply = (parentId: number, newComment: string) => {
    if (!currentUser) return;
    const addedReply: CommentProps = {
      id: generateId(),
      content: newComment,
      createdAt: new Date().toISOString(),
      score: 0,
      replyingTo: replyingTo(commentsList, parentId),
      user: currentUser,
      replies: [],
    };

    setCommentsList((prevComments) =>
      prevComments.map((comment: CommentProps) =>
        comment.id === parentId
          ? { ...comment, replies: [...comment.replies, addedReply] }
          : comment,
      ),
    );
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

  /* NEW COMMENT */

  const addComment = (newComment: string) => {
    if (!currentUser) return;
    const addedComment: CommentProps = {
      id: generateId(),
      content: newComment,
      createdAt: new Date().toISOString(),
      score: 0,
      user: currentUser,
      replies: [],
    };

    setCommentsList((prevComments) => [...prevComments, addedComment]);
  };

  const handleAddComment: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return; /* prevent submitting empty comment */

    addComment(newComment);
    setNewComment("");
  };

  return (
    <>
      <div className="content-wrapper w-[90vw] max-w-[700px] space-y-4">
        <h1>Comments</h1>
        {commentsList.map((comment: CommentProps) => (
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

            {comment.replies?.map((reply: CommentProps) => (
              <div
                className="replies ml-4 space-y-4 md:ml-[4rem]"
                key={reply.id}
              >
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

export default CommentsList;
