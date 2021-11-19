import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useNotesContext } from '../../contexts/NotesContext';
import { Button, Popconfirm, Input, Card, Row, Col, Tooltip, Divider, Spin } from 'antd';
import EmptyCustom from '../../components/EmptyCustom/EmptyCustom';
import {
  ArrowRightOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import { message } from 'antd';
import moment from 'moment';
import { DummyClassrooms } from '../Classrooms/Classrooms';

const { Meta } = Card;
const Notes = () => {
  const [newNoteName, setNewNoteName] = useState('')
  const [isLoading, setIsLoading] = useState(true);
  const { notesState: { notes, isLoading: notesLoading },
    notesActions: { getNotes, addNote, removeNote } } = useNotesContext();

  useEffect(() => {
    getNotes();
    setIsLoading(false);
  }, [])


  const handleAddNote = () => {
    if (!newNoteName) {
      message.error("Name is required")
    }
    else {
      addNote({ name: newNoteName })
    }
    setNewNoteName('')
  }

  const handleCancel = () => {
    setNewNoteName('')
  }

  if (isLoading) {
    return <Spin tip="Loading..." className="spinner" />
  }

  return (
    <div style={{ padding: '5% 10%' }}>
      <Popconfirm
        icon={<></>}
        title={
          <Input placeholder="Name of the note"
            value={newNoteName}
            onChange={(e) => setNewNoteName(e.target.value)}
          />
        }
        okText={"Create"}
        placement="right"
        onConfirm={handleAddNote}
        onCancel={handleCancel}
      >
        <Button type="primary">
          Create a new note
        </Button>
        <Divider />
      </Popconfirm>
      {notesLoading ? <DummyClassrooms /> :
        <Row gutter={[16, 16]} className='classrooms-card-container'>
          {
            notes.length === 0 ? <EmptyCustom description="No notes found"/>
            :
            notes.map((note) => {
              return <Col sm={24}
                md={12} lg={8}
                key={note.id}
              >
                <Card
                  actions={
                    [<Link to={`/notes/${note.id}`}>
                      <Tooltip title="Open Note" placement="bottom">
                        <ArrowRightOutlined />
                      </Tooltip>
                    </Link>,
                    <Popconfirm
                      title="Are you sure?"
                      onConfirm={() => removeNote({ id: note.id })}>
                      <Tooltip title="Delete Note" placement="bottom">
                        <DeleteOutlined />
                      </Tooltip>
                    </Popconfirm>
                    ]}>
                  <Meta
                    title={note.name}
                    description={<>
                      <p>created on: {moment(note.createdAt).format('MM/DD/YYYY')}</p>
                      <p>last modified on: {moment(note.updatedAt).format('MM/DD/YYYY')}</p>
                    </>}
                  />
                </Card>
              </Col>
            })
          }
        </Row>
      }
    </div>
  )
}

export default Notes

