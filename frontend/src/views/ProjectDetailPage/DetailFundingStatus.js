import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DetailFundingStatus.css";
import bee_yellow from "../../img/bee_yellow.svg";

const DetailFundingStatus = ({ projectId }) => {
  const [targetAmount, setTargetAmount] = useState(0);
  const [currentAmount, setCurrentAmount] = useState(0);

  useEffect(() => {
    const fetchFundingStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/projects/${projectId}`
        );
        setTargetAmount(response.data.target_amount);
        setCurrentAmount(response.data.current_amount);
      } catch (error) {
        console.error("Error fetching funding status:", error);
      }
    };

    fetchFundingStatus();
  }, [projectId]);

  const achievementRate = ((currentAmount / targetAmount) * 100).toFixed(2);

  return (
    <div className="ProjectDetailPage-funding-wrap">
      <div className="ProjectDetailPage-funding">
        <div className="ProjectDetailPage-funding-title">현재 달성 금액</div>
        <div className="ProjectDetailPage-money">
          {currentAmount.toLocaleString()} <span>원</span>
        </div>
        <div className="ProjectDetailPage-status">
          <div className="ProjectDetailPage-status-bar">
            <div className="ProjectDetailPage-status-bar-bg">
              <div
                className="ProjectDetailPage-status-bar-bee"
                style={{ width: `${achievementRate}%` }}
              >
                <img
                  src={bee_yellow}
                  alt="bee_yellow"
                  className="ProjectDetailPage-status-icon"
                />
              </div>
            </div>
          </div>
          <div className="ProjectDetailPage-status-rate">
            {achievementRate} <span>% 달성중</span>
          </div>
          <div className="ProjectDetailPage-status-money">
            목표 금액 {targetAmount.toLocaleString()} <span>원</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailFundingStatus;
