import React from "react";

function RecentlyViewed() {

  const viewed =
    JSON.parse(
      localStorage.getItem("recent")
    ) || [];

  return (

    <div>

      <h2>Recently Viewed</h2>

      {viewed.map((item) => (

        <div key={item._id}>

          {item.name}

        </div>

      ))}

    </div>

  );

}

export default RecentlyViewed;