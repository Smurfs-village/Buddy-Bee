import "./DetailContent.css";

const DetailContent = ({ content }) => {
  return (
    <div
      className="ProjectDetailPage-content"
      dangerouslySetInnerHTML={{ __html: content }}
    ></div>
  );
};

export default DetailContent;
