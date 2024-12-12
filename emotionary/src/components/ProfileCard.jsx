import React from "react";

export default function ProfileCard({ user }) {
  return (
    <div className="profile-card">
      <img src={user.profileImage} alt={`${user.username}'s profile`} />
      <h2>{user.username}</h2>
      <p>{user.email}</p>
    </div>
  );
}
