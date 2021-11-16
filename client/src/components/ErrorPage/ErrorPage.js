import React from 'react'
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';


const ErrorPage = ({ status, title, subTitle }) => {
  return <Result
    status={status || "404"}
    title={title || "404"}
    subTitle={subTitle || "Sorry, the page you visited does not exist."}
    extra={
      <Link to="/">
        <Button type="primary">Back Home</Button>
      </Link>
    }
  />
}

export default ErrorPage
