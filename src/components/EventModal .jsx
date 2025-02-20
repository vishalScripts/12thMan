import React, { useState } from "react";

const EventModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    onSubmit({ title, start, end, description });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Create Event</h2>
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-full mb-4"
        />
        <input
          type="datetime-local"
          placeholder="Start Time"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-full mb-4"
        />
        <input
          type="datetime-local"
          placeholder="End Time"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-full mb-4"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-full mb-4"
        />
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
