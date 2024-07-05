import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./Aside.css";

const Aside = () => {
    const profileRef = useRef();
    const postsRef = useRef();
    const participatedProjectRef = useRef();
    const bookmarksRef = useRef();

    useEffect(() => {
        profileRef.current.style.color = "black";
    }, []); // 마운트시 프로필 설정 카테고리 색 설정

    return (
        <div className="MyProfile_main_aside">
            <Link to="/profile" style={{ textDecoration: "none" }}>
                <p className="MyProfile_main_aside_category" ref={profileRef}>
                    프로필 설정
                </p>
            </Link>
            <Link to="/profile/posts" style={{ textDecoration: "none" }}>
                <p
                    className="MyProfile_main_aside_category"
                    id="posts"
                    ref={postsRef}
                >
                    작성한 글
                </p>
            </Link>
            <Link
                to="/profile/participated-projects"
                style={{ textDecoration: "none" }}
            >
                <p
                    className="MyProfile_main_aside_category"
                    ref={participatedProjectRef}
                >
                    참여중인 프로젝트
                </p>
            </Link>
            <Link to="/profile/bookmarks" style={{ textDecoration: "none" }}>
                <p className="MyProfile_main_aside_category" ref={bookmarksRef}>
                    나의 꿀단지
                </p>
            </Link>
            <div className="MyProfile_main_aside_deleteId_wrapper">
                <p className="MyProfile_main_aside_deleteId">회원탈퇴</p>
            </div>
        </div>
    );
};

export default Aside;
