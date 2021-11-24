import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext.jsx";
import { useClassroomsContext } from "../../contexts/ClassroomsContext.jsx";
import useLoader from "../../hooks/useLoader.js";
import AddClassroom from "../../components/AddClassroom/AddClassroom.jsx";
import ClassroomCard from "../../components/ClassroomCard/ClassroomCard.jsx";
import EmptyCustom from "../../components/EmptyCustom/EmptyCustom.jsx";
import { Row, Col, Tooltip, Tabs, Popconfirm, Divider } from "antd";
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  ArrowRightOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import "./Classrooms.css";

const { TabPane } = Tabs;

const Classrooms = () => {
  const {
    authState: { user },
  } = useAuthContext();
  const {
    classroomsState: {
      isLoading,
      classrooms, // list of all classrooms with info
      userClassrooms, // list of classroom id's the user in
      classroomRequests, // list of classroom requests from the user
    },
    classroomsActions: {
      addClassroom,
      postRequest,
      withdrawRequest,
      leaveClassroom,
    },
  } = useClassroomsContext();
  const [yourClassrooms, setYourClassrooms] = useState([]);
  const [browseClassrooms, setBrowseClassrooms] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [tabsDataLoading, setTabsDataLoading] = useLoader(true);
  const [buttonLoader, setButtonLoader] = useLoader(false);

  useEffect(() => {
    setYourClassrooms(
      // filter list of all classrooms whose id is in user classrooms list
      classrooms.filter((classroom) => userClassrooms.includes(classroom.id))
    );
    // filter list of all classrooms whose id is in user classroom requests by user
    setPendingRequests(
      classrooms.filter((classroom) => classroomRequests.includes(classroom.id))
    );
    // remaining classes are the classes that user is not part of
    setBrowseClassrooms(
      classrooms.filter(
        (classroom) =>
          !userClassrooms.includes(classroom.id) &&
          !classroomRequests.includes(classroom.id)
      )
    );
    // as tabs data is loaded, loader should be removed
    setTabsDataLoading(false);
  }, [classrooms, userClassrooms, classroomRequests, setTabsDataLoading]);

  const handleAddClassroom = (payload) => {
    setButtonLoader(true);
    addClassroom(payload).finally(() => setButtonLoader(false));
  };

  const handleSendRequest = (classroom) => {
    const { id: classroom_id } = classroom;
    setTabsDataLoading(true);
    postRequest({ classroom_id }).finally(() => setTabsDataLoading(false));
  };
  const handleLeaveClassroom = (classroom) => {
    const { id: classroom_id } = classroom;
    setTabsDataLoading(true);
    leaveClassroom({
      user_id: user.id,
      classroom_id,
    });
    // page will be reloaded whenever we leave the classroom because if the user who's leaving the classroom is admin then the entire classroom will be deleted.
  };
  const handleWithdrawRequest = (payload) => {
    const { id } = payload;
    setTabsDataLoading(true);
    withdrawRequest({ id }).finally(() => setTabsDataLoading(false));
    // tabsDataLoading will be reset in the useEffect
  };

  return (
    <div className="content-container">
      {user.role === "faculty" && (
        // Faculties can create classrooms
        <>
          <AddClassroom
            handleSubmit={handleAddClassroom}
            loading={buttonLoader}
          />
          <Divider />
        </>
      )}
      <Tabs defaultActiveKey="1" centered tabBarGutter={70}>
        {/* User Classrooms Tab  */}
        <TabPane tab="Your Classrooms" key="1">
          {isLoading || tabsDataLoading ? (
            // skeleton loading classroom card
            <DummyClassrooms />
          ) : (
            <Row gutter={[16, 16]} className="classrooms-card-container">
              {yourClassrooms.length > 0 ? (
                yourClassrooms.map((classroom) => {
                  return (
                    <Col sm={24} md={12} lg={8} key={classroom.id}>
                      <ClassroomCard
                        title={classroom.name}
                        bordered={false}
                        description={classroom.description}
                        actions={[
                          // opening classroom component
                          <Link to={`/classrooms/${classroom.id}`}>
                            <Tooltip title="Open Classroom" placement="bottom">
                              <ArrowRightOutlined />
                            </Tooltip>
                          </Link>,
                          // leaving classroom
                          // classroom will be deleted, if the user is admin
                          <Popconfirm
                            title="Note: If you are the admin of this classroom. 
                      Leaving it will also delete the classroom. Are you sure?"
                            onConfirm={() => handleLeaveClassroom(classroom)}
                          >
                            <Tooltip title="Leave Classroom" placement="bottom">
                              <UserDeleteOutlined />
                            </Tooltip>
                          </Popconfirm>,
                        ]}
                      />
                    </Col>
                  );
                })
              ) : (
                // if no classrooms are found under this tab, empty component is displayed
                <EmptyCustom description="No classrooms found" />
              )}
            </Row>
          )}
        </TabPane>
        {/* Browse Classrooms Tab  */}
        <TabPane tab="Browse Classrooms" key="2">
          {isLoading || tabsDataLoading ? (
            <DummyClassrooms />
          ) : (
            <Row gutter={[16, 16]} className="classrooms-card-container">
              {browseClassrooms.length > 0 ? (
                browseClassrooms.map((classroom) => {
                  return (
                    <Col sm={24} md={12} lg={8} key={classroom.id}>
                      <ClassroomCard
                        title={classroom.name}
                        bordered={false}
                        description={classroom.description}
                        actions={[
                          // sending request on clicking
                          <span onClick={() => handleSendRequest(classroom)}>
                            <Tooltip title="Request to join" placement="bottom">
                              <PlusCircleOutlined />
                            </Tooltip>
                          </span>,
                        ]}
                      />
                    </Col>
                  );
                })
              ) : (
                // if no classrooms are found under this tab, we'll show empty component
                <EmptyCustom description="No classrooms found" />
              )}
            </Row>
          )}
        </TabPane>
        {/* Pending Requests Tab */}
        <TabPane tab="Pending Requests" key="3">
          {isLoading || tabsDataLoading ? (
            <DummyClassrooms />
          ) : (
            <Row gutter={[16, 16]} className="classrooms-card-container">
              {pendingRequests.length > 0 ? (
                pendingRequests.map((classroom) => {
                  return (
                    <Col sm={24} md={12} lg={8} key={classroom.id}>
                      <ClassroomCard
                        title={classroom.name}
                        bordered={false}
                        description={classroom.description}
                        actions={[
                          // withdrawing request
                          <span
                            onClick={() => handleWithdrawRequest(classroom)}
                          >
                            <Tooltip
                              title="Withdraw Request"
                              placement="bottom"
                            >
                              <MinusCircleOutlined />
                            </Tooltip>
                          </span>,
                        ]}
                      />
                    </Col>
                  );
                })
              ) : (
                // if no classrooms are found under this tab, we'll show empty component
                <EmptyCustom description="No requests found" />
              )}
            </Row>
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

export const DummyClassrooms = () => {
  // skeleton loading cards
  return (
    <Row gutter={[16, 16]} className="classrooms-card-container">
      {["dum1", "dum2", "dum3", "dum4", "dum5"].map((ele) => (
        <Col sm={24} md={12} lg={8} key={ele}>
          <ClassroomCard
            bordered={false}
            title={""}
            description={""}
            loading={true}
          />
        </Col>
      ))}
    </Row>
  );
};

export default Classrooms;
