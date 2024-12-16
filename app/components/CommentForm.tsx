import React, { useState } from "react";
import { CurrentUser } from "./CommentsPage";
import Comment from "./Comment";

interface CommentFormProps {
  currentUser: CurrentUser | null;
  handleSubmit: any;
}

const CommentForm = ({ currentUser, handleSubmit }: CommentFormProps) => {
  const [newComment, setNewComment] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  return (
    <>
      <form className="comment-form rounded-md bg-white p-5">
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
        ></textarea>
        <button
          type="submit"
          className="submit-button md:px-auto rounded-lg bg-mod-blue p-3 font-[500] text-white md:h-[3rem]"
          onSubmit={handleSubmit}
        >
          SEND
        </button>
      </form>
    </>
  );
};

export default CommentForm;
