"use client";

import React, { useState, useRef } from "react";
import { CurrentUser, ActiveComment } from "./CommentsList";

const iconPlus = (
  <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"
      fill="#C5C6EF"
    />
  </svg>
);

const iconMinus = (
  <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"
      fill="#C5C6EF"
    />
  </svg>
);

const iconEdit = (
  <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z"
      fill="#5357B6"
    />
  </svg>
);

const iconDelete = (
  <svg width="12" height="14" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z"
      fill="#ED6368"
    />
  </svg>
);

const iconReply = (
  <svg width="14" height="13" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z"
      fill="#5357B6"
    />
  </svg>
);

export interface CommentProps {
  id: number;
  content: string;
  createdAt: string;
  relativeTime: string;
  score: number;
  replyingTo?: string;
  user: {
    image: { png: string; webp: string };
    username: string;
  };
  replies: CommentProps[];
  level?: number;
}

export interface CommentComponentProps {
  comment: CommentProps;
  currentUser: CurrentUser | null;
  activeComment: ActiveComment | null;
  deleteComment: (id: number) => void;
  handleEdit: (id: number, newContent: string) => void;
  handleReply: (commentId: number) => void;
  handleToggleEditing: (id: number, isEditing: boolean) => void;
  onClickPlus: (id: number) => void;
  onClickMinus: (id: number) => void;
  /* return type is set to void here because return value isn't relevant to /  won't be used by component */
  /* child component only triggers function, parent handles state update */
}

const Comment = ({
  comment,
  currentUser,
  activeComment,
  handleEdit,
  handleReply,
  deleteComment,
  handleToggleEditing,
  onClickPlus,
  onClickMinus,
}: CommentComponentProps) => {
  const [editedComment, setEditedComment] = useState(comment.content);

  const isUser = comment.user.username === currentUser?.username;

  const MAX_NESTING_LEVEL = 3;

  const isEditing =
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type === "editing";

  const dialogRef =
    useRef<HTMLDialogElement>(
      null,
    ); /* ref allows for direct interaction with DOM element / React component without use of state */

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedComment(e.target.value);
  };

  const handleSaveEdit = () => {
    if (editedComment.trim() === "") return;
    handleEdit(comment.id, editedComment);
  };

  const handleOpenModal = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal(); // ref.current accesses element and allows calling of its methods
    }
  };

  const handleCloseModal = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  return (
    <>
      <div
        className="comment-container card rounded-md bg-white p-5"
        key={comment.id}
      >
        {/* Voting */}
        <div className="voting flex flex-row items-center justify-between rounded-lg bg-v-light-gray p-2 md:mr-2 md:h-[6rem] md:w-auto md:flex-col md:py-3">
          <button
            className="p-1"
            onClick={() => onClickPlus(comment.id)}
            disabled={isUser}
            aria-label="Plus one"
          >
            {iconPlus}
          </button>
          <span className="font-bold text-mod-blue">{comment.score}</span>
          <button
            className="p-1"
            onClick={() => onClickMinus(comment.id)}
            disabled={isUser}
            aria-label="Minus one"
          >
            {iconMinus}
          </button>
        </div>

        {/* Avatar */}
        <div className="user flex items-center space-x-3">
          <div className="avatar-wrapper">
            <img
              srcSet={comment.user.image.png}
              alt="avatar of user"
              className="max-w-[35px]"
            />
          </div>
          {/* Username, createdAt */}
          <span className="font-bold">{comment.user.username}</span>
          {isUser && (
            <span className="badge rounded-[0.2rem] bg-mod-blue p-2 font-[500] text-white">
              you
            </span>
          )}
          <span className="date flex items-center text-gray-blue">
            {comment.relativeTime}
          </span>
        </div>

        {isUser ? (
          <div className="edit flex justify-end space-x-4">
            {/* Delete button */}
            <button
              className="flex items-center space-x-2 transition-opacity hover:opacity-40"
              onClick={handleOpenModal}
              aria-label="Delete comment"
            >
              {iconDelete}{" "}
              <span className="font-bold text-soft-red">Delete</span>
            </button>

            {/* Edit button */}
            <button
              className="flex items-center space-x-2 transition-opacity hover:opacity-40"
              onClick={() => {
                handleToggleEditing(comment.id, !isEditing);
                isEditing && setEditedComment(comment.content);
              }}
              aria-label={isEditing ? "Cancel" : "Edit comment"}
            >
              {iconEdit}{" "}
              <span className="font-bold text-mod-blue">
                {isEditing ? "Cancel" : "Edit"}
              </span>
            </button>
          </div> /* Reply button */
        ) : (
          <>
            {(comment.level ?? 0) < MAX_NESTING_LEVEL - 1 && (
              <button
                className="reply flex items-center justify-end space-x-2 transition-opacity hover:opacity-40"
                onClick={() => handleReply(comment.id)}
                aria-label="Reply"
              >
                {iconReply}{" "}
                <span className="font-bold text-mod-blue">Reply</span>
              </button>
            )}
          </>
        )}

        {isEditing ? (
          <>
            <textarea
              className="comment textarea h-28"
              value={editedComment}
              onChange={handleChange}
            ></textarea>
            <button
              className="update md:px-auto ml-auto mt-2 rounded-lg bg-mod-blue p-3 font-[500] text-white transition-opacity hover:opacity-40 md:w-[55%]"
              onClick={handleSaveEdit}
            >
              UPDATE
            </button>
          </>
        ) : (
          <div className="comment text-gray-blue md:pr-2">
            {comment.replyingTo && (
              <a
                href="#"
                className="font-bold text-mod-blue hover:cursor-pointer"
              >
                @{comment.replyingTo}{" "}
              </a>
            )}
            <p className="inline">{comment.content}</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <dialog ref={dialogRef} className="modal p-4 md:p-0">
        <div className="modal-box w-[100%] max-w-[400px] space-y-2 rounded-lg p-6 md:rounded-md md:p-8">
          <h2 className="text-2xl font-[500]">Delete comment</h2>
          <p className="py-4 text-gray-blue">
            Are you sure you want to delete this comment? This will remove the
            comment and can't be undone.
          </p>
          <div className="modal-action">
            <form method="dialog" className="grid w-full grid-cols-2 gap-3">
              {/* if there is a button in form, it will close the modal */}
              <button
                onClick={handleCloseModal}
                className="rounded-lg bg-gray-blue p-3 text-lg font-[500] text-white"
              >
                NO, CANCEL
              </button>
              <button
                onClick={() => {
                  deleteComment(comment.id);
                  handleCloseModal;
                }}
                className="rounded-lg bg-soft-red p-3 text-lg font-[500] text-white"
              >
                YES, DELETE
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Comment;
