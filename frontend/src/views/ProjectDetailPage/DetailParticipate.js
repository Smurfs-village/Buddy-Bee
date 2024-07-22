import "./DetailParticipate.css";

const DetailParticipate = ({
  currentParticipants,
  handleModify,
  handleDelete,
}) => {
  return (
    <div className="ProjectDetailPage-participate">
      <div className="ProjectDetailPage-participate-txt">
        참여자 수: {currentParticipants}
      </div>
      <div className="ProjectDetailPage-participate-btn">
        <button className="ProjectDetailPage-modify" onClick={handleModify}>
          수정
        </button>
        <button className="ProjectDetailPage-delete" onClick={handleDelete}>
          삭제
        </button>
      </div>
    </div>
  );
};

export default DetailParticipate;
