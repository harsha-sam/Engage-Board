import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNotesContext } from "../../contexts/NotesContext.jsx";
import useLoader from "../../hooks/useLoader.js";
import EmptyCustom from "../../components/EmptyCustom/EmptyCustom.jsx";
import { DummyClassrooms } from "../Classrooms/Classrooms.jsx";
import {
  Button,
  Popconfirm,
  Input,
  Card,
  Row,
  Col,
  Tooltip,
  Divider,
} from "antd";
import { ArrowRightOutlined, DeleteOutlined } from "@ant-design/icons";
import { message } from "antd";
import moment from "moment";

const { Meta } = Card;
const Notes = () => {
  const [newNoteName, setNewNoteName] = useState("");
  // flag used for initial render loading display as we are calling getNotes to fetch all notes after inital render
  const [pageLoading, setPageLoading] = useLoader(true);
  // loader for create new note button
  const [buttonLoader, setButtonLoader] = useLoader(false);
  const {
    notesState: { notes, isLoading: notesLoading },
    notesActions: { getNotes, addNote, removeNote },
  } = useNotesContext();

  useEffect(() => {
    // get notes will be called on mount
    getNotes();
    // setting it false as the inital render is done
    setPageLoading(false);
  }, [getNotes, setPageLoading]);

  const handleAddNote = () => {
    // setting create new note button loader to true as we are adding a note
    setButtonLoader(true);
    if (!newNoteName) {
      message.error("Name is required");
      setButtonLoader(false);
    } else {
      // adding note and resetting create new note button loader
      addNote({ name: newNoteName }).finally(() => setButtonLoader(false));
    }
    setNewNoteName("");
  };

  const handleRemoveNote = (note) => {
    // setting page loader to true as note is being removed
    setPageLoading(true);
    // resetting page loader to false after removing note
    removeNote({ id: note.id }).finally(() => setPageLoading(false));
  };

  const handleCancel = () => setNewNoteName("");

  return (
    <div className="content-container">
      {/* Pop Confirm for taking input the new note name */}
      <Popconfirm
        icon={<></>}
        title={
          <Input
            placeholder="Name of the note"
            value={newNoteName}
            onChange={(e) => setNewNoteName(e.target.value)}
          />
        }
        okText={"Create"}
        placement="right"
        onConfirm={handleAddNote}
        onCancel={handleCancel}
      >
        <Button type="primary" loading={buttonLoader}>
          Create a new note
        </Button>
        <Divider />
      </Popconfirm>
      {notesLoading || pageLoading ? (
        // skeleton cards loading
        <DummyClassrooms />
      ) : (
        <Row gutter={[16, 16]} className="classrooms-card-container">
          {notes.length === 0 ? (
            // if there are no notes, empty component will be rendered
            <EmptyCustom description="No notes found" />
          ) : (
            notes.map((note) => {
              return (
                <Col sm={24} md={12} lg={8} key={note.id}>
                  <Card
                    actions={[
                      <Link to={`/notes/${note.id}`}>
                        <Tooltip title="Open Note" placement="bottom">
                          <ArrowRightOutlined />
                        </Tooltip>
                      </Link>,
                      // Popconfirm when deleting a note
                      <Popconfirm
                        title="Are you sure?"
                        onConfirm={() => handleRemoveNote(note)}
                      >
                        <Tooltip title="Delete Note" placement="bottom">
                          <DeleteOutlined />
                        </Tooltip>
                      </Popconfirm>,
                    ]}
                  >
                    <Meta
                      title={note.name}
                      description={
                        <>
                          <p>
                            created on:{" "}
                            {moment(note.createdAt).format("DD/MM/YYYY")}
                          </p>
                          <p>
                            last modified on:{" "}
                            {moment(note.updatedAt).format("DD/MM/YYYY")}
                          </p>
                        </>
                      }
                    />
                  </Card>
                </Col>
              );
            })
          )}
        </Row>
      )}
    </div>
  );
};

export default Notes;
