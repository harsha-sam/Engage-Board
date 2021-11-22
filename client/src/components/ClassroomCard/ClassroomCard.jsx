import React from "react";
import { Skeleton, Card } from "antd";

const { Meta } = Card;

// card component displayed in classrooms page
const ClassroomCard = ({ loading, title, description, actions }) => {
  // stripping of extra lines out of description
  let formatDescription = description.split(" ");
  if (formatDescription.length >= 10) {
    formatDescription = formatDescription.slice(0, 10);
    formatDescription.push("...");
  }
  formatDescription = formatDescription.join(" ");
  return (
    <Card actions={actions}>
      <Skeleton loading={loading} active>
        <Meta title={title} description={formatDescription} />
      </Skeleton>
    </Card>
  );
};

export default ClassroomCard;
