import React from "react";
import { Empty } from "antd";

// Empty data component with image
const EmptyCustom = ({ description }) => {
  return (
    <Empty
      image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      imageStyle={{
        height: 60,
      }}
      description={description}
    />
  );
};

export default EmptyCustom;
