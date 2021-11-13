import React, { useEffect, useState } from 'react';
import { Row, Col, Tooltip, Tabs, Empty } from 'antd';
import TeamCard from '../../components/TeamCard/TeamCard';
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  ArrowRightOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons'
import './Teams.css';
import { useAuthContext } from '../../contexts/AuthContext';
import { useTeamsContext } from '../../contexts/TeamContext';
import AddTeam from '../../components/AddTeam/AddTeam';

const { TabPane } = Tabs;


const Teams = () => {
  const { authState: { user } } = useAuthContext();
  const { teamsState: { teams, isLoading, userTeams, teamRequests },
    teamsActions: { addTeam, postRequest, withdrawRequest, leaveTeam } } = useTeamsContext();
  let [yourTeams, setYourTeams] = useState([]);
  let [browseTeams, setBrowseTeams] = useState([]);
  let [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    setYourTeams(teams.filter((team) => userTeams.includes(team.id)))
    setPendingRequests(teams.filter((team) => teamRequests.includes(team.id)))
    setBrowseTeams(teams.filter((team) =>
      (!userTeams.includes(team.id) && !teamRequests.includes(team.id))
    ))
  }, [teams, userTeams, teamRequests])

  return (<>
    {
      user.role === 'faculty'
      &&
      <AddTeam handleSubmit={addTeam} />
    }
    <Tabs defaultActiveKey="1" centered tabBarGutter={70}>
      <TabPane tab="Your Classrooms" key="1">
        {isLoading && <DummyTeams />}
        <Row gutter={[16, 16]} className='teams-card-container'>
          {!isLoading && yourTeams.length > 0 ?
            yourTeams.map((team) => {
              return <Col sm={24} md={12} lg={8} key={team.id}>
                <TeamCard title={team.name}
                  bordered={false}
                  description={team.description}
                  actions={[
                    <span>
                      <Tooltip title="Open Team" placement="bottom">
                        <ArrowRightOutlined />
                      </Tooltip>
                    </span>,
                    <span onClick={() => leaveTeam({ team_id: team.id, user_id: user.id })}>
                      <Tooltip title="Leave Team" placement="bottom">
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
                  No teams found
                </span>
              }
            />}
        </Row>
      </TabPane>
      <TabPane tab="Browse Classrooms" key="2">
        {isLoading && <DummyTeams />}
        <Row gutter={[16, 16]} className='teams-card-container'>
          {!isLoading && browseTeams.length > 0 ?
            browseTeams.map((team) => {
              return <Col sm={24} md={12} lg={8} key={team.id}>
                <TeamCard title={team.name}
                  bordered={false}
                  description={team.description}
                  actions={[
                    <span onClick={() => postRequest({ team_id: team.id })}>
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
                  No teams found
                </span>
              }
            />}
        </Row>
      </TabPane>
      <TabPane tab="Pending Requests" key="3">
        {isLoading && <DummyTeams />}
        <Row gutter={[16, 16]} className='teams-card-container'>
          {!isLoading && pendingRequests.length > 0 ?
            pendingRequests.map((team) => {
              return <Col sm={24} md={12} lg={8} key={team.id}>
                <TeamCard title={team.name}
                  bordered={false}
                  description={team.description}
                  actions={[
                    <span onClick={() => withdrawRequest(team)}>
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

const DummyTeams = () => {
  return <Row gutter={[16, 16]} className='teams-card-container'>
    {
      ["dum1", "dum2", "dum3"].map((ele) =>
        <Col sm={24} md={12} lg={8} key={ele}>
          <TeamCard bordered={false}
            title={''}
            description={''}
            loading={true}
          />
        </Col>
      )
    }
  </Row>
}

export default Teams