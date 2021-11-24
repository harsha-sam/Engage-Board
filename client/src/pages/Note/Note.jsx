import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext.jsx";
import { useNotesContext } from "../../contexts/NotesContext.jsx";
import useLoader from "../../hooks/useLoader.js";
// quill text editor
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Breadcrumb, Spin, Button, Typography } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import "./Note.css";

const modules = {
  // header of text editor
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
  ],
};
const { Text } = Typography;
const Note = () => {
  const { id } = useParams();
  // flag used for initial render loading display as we are calling get note based on id after mount to fetch all notes after inital render
  const [pageLoading, setPageLoading] = useState(true);
  // hook to store the disabled state for save changes button
  const [buttonDisabled, setButtonDisabled] = useState(true);
  // loader for save changes button
  const [buttonLoader, setButtonLoader] = useLoader(false);
  // hook to store data of this note
  const [data, setData] = useState("");
  const {
    notesState: { note, isLoading: noteLoading },
    notesActions: { getNote, editNote },
  } = useNotesContext();
  const {
    authState: { user },
  } = useAuthContext();

  useEffect(() => {
    // based on the id from the current route
    // this specific note will be loaded
    getNote({ id });
    // setting it false as the inital render is done
    setPageLoading(false);
  }, [id, getNote, setPageLoading]);

  useEffect(() => {
    // whenever note is updated, save changes button is disabled
    return setButtonDisabled(true);
  }, [note]);

  const handleChange = (content) => {
    if (buttonDisabled) {
      // whenever new changes occur, save changes button is enabled, so that user can save those changes
      setButtonDisabled(false);
    }
    // data is updated with new content
    setData(content);
  };

  const handleSave = () => {
    // on saving the Changes
    // save changes button loader will be true as the note is being saved
    setButtonLoader(true);
    // save changes button loader will be reset after the note is successfully saved
    editNote({ id: note.id, data, name: note.name }).finally(() =>
      setButtonLoader(false)
    );
  };

  // if the current note is loading or on the inital render before getNote is called, loader is displayed
  if (pageLoading || noteLoading) {
    return <Spin tip="Loading..." className="spinner" />;
  }

  return (
    <section className="notes-page">
      <Breadcrumb className="bread-crumb">
        <Breadcrumb.Item>
          <Link to={"/"}>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={"/notes"}>Notes</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{note.name}</Breadcrumb.Item>
      </Breadcrumb>
      <div className="editor">
        {note.created_by === user.id ? (
          <>
            <Button
              type="primary"
              className="btn"
              disabled={buttonDisabled}
              onClick={handleSave}
              loading={buttonLoader}
            >
              Save Changes
            </Button>
            <h4>
              <strong>
                To share this note, please share the current page link. Anyone
                with this link can view this note but cannot edit it.
              </strong>
            </h4>
          </>
        ) : (
          // if this note is not created by the current authorized user, then no changes can be made to note
          <Text type="danger">
            This is a read only note. You can't edit this. It is owned by
            someone else
          </Text>
        )}
        <ReactQuill
          readOnly={note.created_by !== user.id}
          defaultValue={note.data}
          theme="snow"
          onChange={handleChange}
          modules={modules}
        />
      </div>
    </section>
  );
};

export default Note;
