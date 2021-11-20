import React from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { Result, Button } from "antd";

const ErrorPage = ({ status, title, subTitle }) => {
  const { state } = useLocation();
  title = title || state?.title;
  status = status || state?.status;
  subTitle = subTitle || state?.subTitle;
  return (
    <Result
      status={status || "404"}
      title={title || "404"}
      subTitle={subTitle || "Sorry, the page you visited does not exist."}
      extra={
        <Link to="/">
          <Button type="primary">Back Home</Button>
        </Link>
      }
    />
  );
};

export default ErrorPage;
