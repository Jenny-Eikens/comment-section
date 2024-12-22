"use client";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
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

dayjs.extend(relativeTime);

const getRelativeTime = (dateString: string) => {
  return dayjs(dateString).fromNow();
};

const CommentsList = ({ comments, currentUser }: CommentsListProps) => {
  /* make sure comments and replies always have a replies array */
  const initializeComments = (comments: CommentProps[]): CommentProps[] => {
    return comments.map((comment) => ({
      ...comment,
      level: 0,
      relativeTime: getRelativeTime(comment.createdAt),
      replies: comment.replies ? initializeComments(comment.replies) : [],
    }));
  };

  const [commentsList, setCommentsList] = useState(
    initializeComments(comments),
  );

  useEffect(() => {
    const updateRelativeTime = (comments: CommentProps[]): CommentProps[] => {
      return comments.map((comment) => ({
        ...comment,
        relativeTime: getRelativeTime(comment.createdAt),
        replies: updateRelativeTime(comment.replies), // Recursively update replies
      }));
    };
    const interval = setInterval(() => {
      setCommentsList((prevComments) => updateRelativeTime(prevComments));
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [comments]);

  const [activeComment, setActiveComment] = useState<ActiveComment | null>(
    null,
  );
  const [newComment, setNewComment] = useState("");

  const generateId = () => Date.now() + Math.random();

  const renderReplies = (replies: CommentProps[], level = 1) => {
    return (
      <div className="replies ml-4 space-y-4 md:ml-[4rem]">
        {replies.map((reply) => (
          <div key={reply.id} className="space-y-4">
            <Comment
              key={reply.id}
              comment={{
                ...reply,
                level,
              }}
              currentUser={currentUser}
              activeComment={activeComment}
              setActiveComment={setActiveComment}
              handleReply={handleReply}
              deleteComment={deleteComment}
              editComment={handleEditComment}
            />
            {/* Render the reply form for the active comment */}
            {activeComment &&
              activeComment.id === reply.id &&
              activeComment.type === "replying" && (
                <CommentForm
                  currentUser={currentUser}
                  initialValue=""
                  onSubmit={(text: string) => handleAddReply(reply.id, text)}
                  submitLabel="REPLY"
                />
              )}
            {/* Recursively render nested replies */}
            {reply.replies?.length > 0 &&
              renderReplies(reply.replies, level + 1)}
          </div>
        ))}
      </div>
    );
  };

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

  const handleReply = (commentId: number) => {
    if (activeComment?.id === commentId) {
      setActiveComment(null);
    } else {
      setActiveComment({ type: "replying", id: commentId });
    }
  };

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
      relativeTime: getRelativeTime(new Date().toISOString()),
      score: 0,
      replyingTo: replyingTo(commentsList, parentId),
      user: currentUser,
      replies: [],
      level: undefined,
    };

    const updateReplies = (
      commentsList: CommentProps[],
      currentLevel = 1,
    ): CommentProps[] => {
      return commentsList.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [
              ...comment.replies,
              { ...addedReply, level: currentLevel },
            ],
          };
        } else if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: updateReplies(comment.replies, currentLevel + 1),
          };
        }
        return comment;
      });
    };

    setCommentsList((prevComments) => {
      const updatedComments = updateReplies(prevComments);
      return updatedComments;
    });
    setActiveComment(null);
  };

  const handleAddReply = (parentId: number, text: string) => {
    if (text.trim() === "") return;
    addReply(parentId, text);
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
      relativeTime: getRelativeTime(new Date().toISOString()),
      score: 0,
      user: currentUser,
      replies: [],
      level: 0,
    };

    setCommentsList((prevComments) => [...prevComments, addedComment]);
  };

  const handleAddComment = (text: string) => {
    if (text.trim() === "") return;

    addComment(text); // Call addComment with the provided text
  };

  return (
    <>
      <div className="content-wrapper w-[90vw] max-w-[700px] space-y-4">
        <h1>Comments</h1>
        {commentsList.map((comment: CommentProps) => (
          <div key={comment.id} className="space-y-4">
            <Comment
              key={comment.id}
              comment={{ ...comment, relativeTime: comment.relativeTime }}
              currentUser={currentUser}
              activeComment={activeComment}
              setActiveComment={setActiveComment}
              handleReply={handleReply}
              deleteComment={deleteComment}
              editComment={handleEditComment}
            />

            {/* Conditionally render the reply form in the parent */}
            {activeComment &&
              activeComment.id === comment.id &&
              activeComment.type === "replying" && (
                <CommentForm
                  currentUser={currentUser}
                  initialValue=""
                  onSubmit={(text: string) => handleAddReply(comment.id, text)}
                  submitLabel="REPLY"
                />
              )}

            {/* Render top-level replies */}
            {comment.replies?.length > 0 && renderReplies(comment.replies)}
          </div>
        ))}
        <CommentForm
          currentUser={currentUser}
          initialValue=""
          onSubmit={handleAddComment}
          submitLabel="SEND"
        />
      </div>
    </>
  );
};

export default CommentsList;
