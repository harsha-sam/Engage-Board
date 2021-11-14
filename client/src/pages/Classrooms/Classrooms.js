import React, { useEffect, useState } from 'react';
import { Row, Col, Tooltip, Tabs, Empty } from 'antd';
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

  return (<>
    {
      user.role === 'faculty'
      &&
      <AddClassroom handleSubmit={addClassroom} />
    }
    <Tabs defaultActiveKey="1" centered tabBarGutter={70}>
      <TabPane tab="Your Classrooms" key="1">
        {isLoading && <DummyClassrooms />}
        <Row gutter={[16, 16]} className='classrooms-card-container'>
          {!isLoading && yourClassrooms.length > 0 ?
            yourClassrooms.map((classroom) => {
              return <Col sm={24} md={12} lg={8} key={classroom.id}>
                <ClassroomCard title={classroom.name}
                  bordered={false}
                  description={classroom.description}
                  actions={[
                    <span>
                      <Tooltip title="Open Classroom" placement="bottom">
                        <ArrowRightOutlined />
                      </Tooltip>
                    </span>,
                    <span onClick={() => leaveClassroom({ classroom_id: classroom.id, user_id: user.id })}>
                      <Tooltip title="Leave Classroom" placement="bottom">
                        <UserDeleteOutlined />
                      </Tooltip>
                    </span>
                  ]
                  }
                />
        </Col>
            })
        : <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{
            height: 60,
          }}
          description={
            <span>
              No classrooms found
            </span>
          }
        />}
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
                  <span onClick={() => postRequest({ classroom_id: classroom.id })}>
                    <Tooltip title="Request to join" placement="bottom">
                      <PlusCircleOutlined />
                    </Tooltip>,
                  </span>
                ]
                }
              />
            </Col>
          })
          : <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{
              height: 60,
            }}
            description={
              <span>
                No classrooms found
              </span>
            }
          />}
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
                  <span onClick={() => withdrawRequest(classroom)}>
                    <Tooltip title="Withdraw Request" placement="bottom">
                      <MinusCircleOutlined />
                    </Tooltip>
                  </span>
                ]
                }
              />
            </Col>
          })
          : <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{
              height: 60,
            }}
            description={
              <span>
                No requests found
              </span>
            }
          />}
      </Row>
    </TabPane>
  </Tabs>
  </>
  )
}

const DummyClassrooms = () => {
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