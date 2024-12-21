"use client";

import React, { SetStateAction, useState } from "react";
import { CurrentUser } from "./CommentsList";

interface CommentFormProps {
  currentUser: CurrentUser | null;
  initialValue: string;
  submitLabel: string;
  newComment: string;
  setNewComment: React.Dispatch<SetStateAction<string>>;
  onSubmit: any;
}

const CommentForm = ({
  currentUser,
  submitLabel,
  initialValue = "",
  newComment,
  setNewComment,
  onSubmit,
}: CommentFormProps) => {
  const [commentText, setCommentText] = useState(initialValue);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (commentText.trim() === "") return;
    onSubmit(commentText);
    setCommentText(""); // Clear the input after submission
  };

  return (
    <>
      <form
        className="comment-form rounded-md bg-white p-5"
        onSubmit={handleSubmit}
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
          className="new-comment textarea textarea-bordered h-20 resize-none border border-light-gray"
          onChange={handleChange}
          value={commentText}
        ></textarea>
        <button
          type="submit"
          className="submit-button md:px-auto rounded-lg bg-mod-blue p-3 font-[500] text-white md:h-[3rem]"
        >
          {submitLabel}
        </button>
      </form>
    </>
  );
};

export default CommentForm;
