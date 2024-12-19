"use client";

import React, { SetStateAction } from "react";
import { CurrentUser } from "./CommentsList";

interface CommentFormProps {
  currentUser: CurrentUser | null;
  submitLabel: string;
  newComment: string;
  setNewComment: React.Dispatch<SetStateAction<string>>;
  onSubmit: any;
}

const CommentForm = ({
  currentUser,
  submitLabel,
  newComment,
  setNewComment,
  onSubmit,
}: CommentFormProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  return (
    <>
      <form
        className="comment-form rounded-md bg-white p-5"
        onSubmit={onSubmit}
      >
        <div className="flex items-center md:items-start">
          <img
            srcSet={currentUser?.image.png}
            alt="Avatar of current user"
            className="current-user max-w-[35px]"
          />
        </div>
        <textarea
          placeholder="Add a comment..."
          className="new-comment textarea textarea-bordered h-20 resize-none border border-light-gray"
          onChange={handleChange}
          value={newComment}
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
