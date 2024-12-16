import React, { SetStateAction } from "react";
import { CurrentUser } from "./CommentsPage";

export interface CommentFormProps {
  currentUser: CurrentUser | null;
  newComment: string;
  setNewComment: React.Dispatch<SetStateAction<string>>;
  addComment: (newComment: string) => void;
  isReplying: boolean;
  setIsReplying: React.Dispatch<SetStateAction<boolean>>;
}

const CommentForm = ({
  currentUser,
  newComment,
  setNewComment,
  addComment,
  isReplying,
  setIsReplying,
}: CommentFormProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return; /* prevent submitting empty comment */

    addComment(newComment);
    setNewComment("");
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
          placeholder="Add a comment..."
          className="new-comment textarea textarea-bordered h-20 resize-none border border-light-gray"
          onChange={handleChange}
          value={newComment}
        ></textarea>
        <button
          type="submit"
          className="submit-button md:px-auto rounded-lg bg-mod-blue p-3 font-[500] text-white md:h-[3rem]"
        >
          {isReplying ? "REPLY" : "SEND"}
        </button>
      </form>
    </>
  );
};

export default CommentForm;
