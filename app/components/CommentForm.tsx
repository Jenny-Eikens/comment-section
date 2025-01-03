"use client";

import React, { useState } from "react";
import { CurrentUser } from "./CommentsList";

interface CommentFormProps {
  currentUser: CurrentUser | null;
  initialValue: string;
  submitLabel: string;
  onSubmit: (text: string) => void;
}

const CommentForm = ({
  currentUser,
  submitLabel,
  initialValue,
  onSubmit,
}: CommentFormProps) => {
  const [commentText, setCommentText] = useState(initialValue);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (commentText.trim() === "") {
      const errorMessage =
        submitLabel === "SEND"
          ? "Comment can't be empty!"
          : "Reply can't be empty!";
      alert(errorMessage);
      return;
    }
    onSubmit(commentText);
    setCommentText("");
  };

  return (
    <>
      <form
        className="comment-form rounded-md bg-base-300 p-5"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="flex items-center md:items-start">
          <img
            srcSet={currentUser?.image.png}
            alt="Avatar of current user"
            className="current-user max-w-[35px]"
          />
        </div>
        <textarea
          placeholder={
            submitLabel === "SEND" ? "Add a comment..." : "Add a reply..."
          }
          className="new-comment h-24"
          onChange={handleChange}
          value={commentText}
        ></textarea>
        <button
          type="submit"
          className="submit-button md:px-auto rounded-lg bg-primary p-3 font-[500] text-base-100 transition-opacity hover:opacity-40 md:h-[3rem]"
        >
          {submitLabel}
        </button>
      </form>
    </>
  );
};

export default CommentForm;
