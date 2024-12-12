import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUsers, fetchBookmarksByUserId, fetchEmotions } from "../api/api";
import ProfileCard from "../components/ProfileCard";
import ReactionList from "../components/ReactionList";

function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reactions, setReactions] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      try {
        const users = await fetchUsers();
        console.log("Users fetched:", users);
        const emotions = await fetchEmotions();
        console.log("Emotions fetched:", emotions);
        const bookmarks = await fetchBookmarksByUserId(userId);
        console.log("Bookmarks fetched for user:", userId, bookmarks);

        const currentUser = users.find((u) => u.id === parseInt(userId));
        const userReactions = emotions.filter(
          (e) => e.userId === parseInt(userId)
        );
        const userBookmarks = bookmarks
          .map((b) => emotions.find((e) => e.id === b.emotionId))
          .filter(Boolean);

        setAllUsers(users);
        setUser(currentUser || null);
        setReactions(userReactions);
        setBookmarks(userBookmarks);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [userId]);

  const handleUserChange = (e) => {
    navigate(`/profile/${e.target.value}`);
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="container">
      <h1>User Profile</h1>

      <label htmlFor="user-select">Select User: </label>
      <select
        id="user-select"
        value={parseInt(userId) || ""}
        onChange={handleUserChange}
        className="user-select"
      >
        {allUsers.map((user) => (
          <option key={user.id} value={user.id}>
            {user.username}
          </option>
        ))}
      </select>

      {user ? (
        <>
          <ProfileCard user={user} />

          <h2>Your Reactions</h2>
          <ReactionList reactions={reactions} />

          <h2>Your Bookmarked Reactions</h2>
          <ReactionList reactions={bookmarks} />
        </>
      ) : (
        <p>User not found.</p>
      )}
    </div>
  );
}

export default Profile;
