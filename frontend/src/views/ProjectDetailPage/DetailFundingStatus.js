import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./DetailFundingStatus.css";
import bee_yellow from "../../img/bee_yellow.svg";

const DetailFundingStatus = ({ projectId, currentAmount }) => {
  const [targetAmount, setTargetAmount] = useState(0);
  const barRef = useRef(null);
  const [barWidth, setBarWidth] = useState(0);
  const beeRef = useRef(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchFundingStatus = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/projects/${projectId}`
        );
        setTargetAmount(response.data.target_amount);
      } catch (error) {
        console.error("Error fetching funding status:", error);
      }
    };

    fetchFundingStatus();
  }, [projectId, API_BASE_URL]);

  const achievementRate =
    targetAmount > 0 ? ((currentAmount / targetAmount) * 100).toFixed(2) : 0;

  useEffect(() => {
    const updateBarWidth = () => {
      if (barRef.current) {
        setBarWidth(barRef.current.offsetWidth);
      }
    };

    updateBarWidth();
    window.addEventListener("resize", updateBarWidth);
    return () => window.removeEventListener("resize", updateBarWidth);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (barRef.current) {
      observer.observe(barRef.current);
    }

    return () => {
      if (barRef.current) {
        observer.unobserve(barRef.current);
      }
    };
  }, []);

  return (
    <div className="ProjectDetailPage-funding-wrap">
      <div className="ProjectDetailPage-funding">
        <div className="ProjectDetailPage-funding-title">현재 달성 금액</div>
        <div className="ProjectDetailPage-money">
          {currentAmount ? parseInt(currentAmount).toLocaleString() : 0}{" "}
          <span>원</span>
        </div>
        <div className="ProjectDetailPage-status">
          <div className="ProjectDetailPage-status-bar">
            <div
              className="ProjectDetailPage-status-bar-bg"
              ref={barRef}
              style={{ position: "relative" }}
            >
              <div
                className="ProjectDetailPage-status-bar-bee"
                style={{ width: `${achievementRate}%` }}
              >
                <img
                  src={bee_yellow}
                  alt="bee_yellow"
                  className="ProjectDetailPage-status-icon"
                  ref={beeRef}
                  style={{
                    transform: `translateX(${
                      (barWidth * achievementRate) / 100 - 17
                    }px)`,
                    transition: "transform 2s ease-out",
                  }}
                />
              </div>
            </div>
          </div>
          <div className="ProjectDetailPage-status-rate">
            {achievementRate} <span>% 달성중</span>
          </div>
          <div className="ProjectDetailPage-status-money">
            목표 금액{" "}
            {targetAmount ? parseInt(targetAmount).toLocaleString() : 0}{" "}
            <span>원</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailFundingStatus;
