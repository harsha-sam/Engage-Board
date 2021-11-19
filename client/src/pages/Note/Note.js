import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useNotesContext } from '../../contexts/NotesContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Breadcrumb, Spin, Button, Typography } from 'antd';
import {
  HomeOutlined
} from '@ant-design/icons'
import './Note.css'

const modules = {
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
  ]
}
const { Text } = Typography;
const Note = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [data, setData] = useState('');
  const { notesState: { note, isLoading: noteLoading }, notesActions: {
    getNote,
    editNote
  } } = useNotesContext();
  const { authState: { user } } = useAuthContext();

  useEffect(() => {
    getNote({ id })
    setIsLoading(false);
  }, [id])

  useEffect(() => {
    return setButtonDisabled(true);
  }, [])

  const handleChange = (content) => {
    if (buttonDisabled) {
      setButtonDisabled(false)
    }
    setData(content);
  }

  const handleSave = () => {
    editNote({ id: note.id, data, name: note?.name })
  }

  if (isLoading || noteLoading) {
    return <Spin tip="Loading..." className="spinner" />
  }

  return (<>
    <Breadcrumb className="bread-crumb">
      <Breadcrumb.Item>
        <Link to={"/"}>
          <HomeOutlined />
        </Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link to={"/notes"}>
          Notes
        </Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>{note.name}</Breadcrumb.Item>
    </Breadcrumb>
    <div className="editor">
      {note.created_by === user.id ?
        <Button type="primary"
          className="btn"
          disabled={buttonDisabled}
          onClick={handleSave}
        >
          Save Changes
        </Button>
        :
        <Text type="danger">
          This is a read only note. You can't edit this. It is owned by someone else
        </Text>}
      <ReactQuill
        readOnly={note.created_by !== user.id}
        defaultValue={note.data}
        theme="snow"
        onChange={handleChange}
        modules={modules}
      />
    </div>
  </>
  )
}

export default Note
