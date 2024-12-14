import React from "react";

function newsCard({ children }) {
  return (
    <div>
      <div className={`card`}>
        <div className="">{children}</div>
      </div>
    </div>
  );
}

export default newsCard;
