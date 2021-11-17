import React, { useEffect, useState } from 'react';
import { Row, Col, Tooltip, Tabs, Popconfirm } from 'antd';
import ClassroomCard from '../../components/ClassroomCard/ClassroomCard';
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  ArrowRightOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons'
import './Classrooms.css';
import { useAuthContext } from '../../contexts/AuthContext';
import { useClassroomsContext } from '../../contexts/ClassroomsContext';
import AddClassroom from '../../components/AddClassroom/AddClassroom';
import EmptyCustom from '../../components/EmptyCustom/EmptyCustom';
import { Link } from 'react-router-dom';

const { TabPane } = Tabs;


const Classrooms = () => {
  const { authState: { user } } = useAuthContext();
  const { classroomsState: { classrooms, isLoading, userClassrooms, classroomRequests },
    classroomsActions: { addClassroom, postRequest, withdrawRequest, leaveClassroom } } = useClassroomsContext();
  let [yourClassrooms, setYourClassrooms] = useState([]);
  let [browseClassrooms, setBrowseClassrooms] = useState([]);
  let [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    setYourClassrooms(classrooms.filter((classroom) => userClassrooms.includes(classroom.id)))
    setPendingRequests(classrooms.filter((classroom) => classroomRequests.includes(classroom.id)))
    setBrowseClassrooms(classrooms.filter((classroom) =>
      (!userClassrooms.includes(classroom.id) && !classroomRequests.includes(classroom.id))
    ))
  }, [classrooms, userClassrooms, classroomRequests])

  return (<div style={{ padding: '5% 10%' }}>
    {
      user.role === 'faculty'
      &&
      <AddClassroom handleSubmit={addClassroom} />
    }
    <Tabs defaultActiveKey="1" centered tabBarGutter={70}>
      <TabPane tab="Your Classrooms" key="1">
        {isLoading && <DummyClassrooms />}
        <Row gutter={[16, 16]} className='classrooms-card-container'>
          {!isLoading && yourClassrooms.length > 0
            ? yourClassrooms.map((classroom) => {
              return <Col sm={24}
                md={12} lg={8}
                key={classroom.id}>
                <ClassroomCard title={classroom.name}
                  bordered={false}
                  description={classroom.description}
                  actions={[
                    <Link to={`/classrooms/${classroom.id}`}>
                      <Tooltip title="Open Classroom" placement="bottom">
                        <ArrowRightOutlined />
                      </Tooltip>
                    </Link>,
                    <Popconfirm
                      title="Note: If you are the admin of this classroom. 
                      Leaving it will also delete the classroom. Are you sure?"
                      onConfirm={() =>
                        leaveClassroom({
                          classroom_id: classroom.id,
                          user_id: user.id
                        })}>
                      <Tooltip title="Leave Classroom" placement="bottom">
                        <UserDeleteOutlined />
                      </Tooltip>
                    </Popconfirm>
                  ]}
                />
              </Col>
            })
            : <EmptyCustom description="No classrooms found" />
          }
        </Row>
      </TabPane>

      <TabPane tab="Browse Classrooms" key="2">
        {isLoading && <DummyClassrooms />}
        <Row gutter={[16, 16]} className='classrooms-card-container'>
          {!isLoading && browseClassrooms.length > 0 ?
            browseClassrooms.map((classroom) => {
              return <Col sm={24} md={12} lg={8} key={classroom.id}>
                <ClassroomCard title={classroom.name}
                  bordered={false}
                  description={classroom.description}
                  actions={[
                    <span onClick={() =>
                      postRequest({ classroom_id: classroom.id })}>
                      <Tooltip title="Request to join" placement="bottom">
                        <PlusCircleOutlined />
                      </Tooltip>,
                    </span>
                  ]}
                />
              </Col>
            })
            : <EmptyCustom description="No classrooms found" />
          }
        </Row>
      </TabPane>

      <TabPane tab="Pending Requests" key="3">
        {isLoading && <DummyClassrooms />}
        <Row gutter={[16, 16]} className='classrooms-card-container'>
          {!isLoading && pendingRequests.length > 0 ?
            pendingRequests.map((classroom) => {
              return <Col sm={24} md={12} lg={8} key={classroom.id}>
                <ClassroomCard title={classroom.name}
                  bordered={false}
                  description={classroom.description}
                  actions={[
                    <span onClick={() =>
                      withdrawRequest(classroom)}>
                      <Tooltip title="Withdraw Request" placement="bottom">
                        <MinusCircleOutlined />
                      </Tooltip>
                    </span>
                  ]}
                />
              </Col>
            })
            :
            <EmptyCustom description="No requests found" />
          }
        </Row>
      </TabPane>
    </Tabs>
  </div>
  )
}

export const DummyClassrooms = () => {
  return <Row gutter={[16, 16]} className='classrooms-card-container'>
    {
      ["dum1", "dum2", "dum3"].map((ele) =>
        <Col sm={24} md={12} lg={8} key={ele}>
          <ClassroomCard bordered={false}
            title={''}
            description={''}
            loading={true}
          />
        </Col>
      )
    }
  </Row>
}

export default Classrooms