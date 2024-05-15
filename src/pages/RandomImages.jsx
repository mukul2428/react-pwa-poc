import React, { useEffect, useState } from "react";
import { getAllImagesList } from "../api/randomImages";

const RandomImages = () => {
  const [imagesData, setimagesData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getAllImagesList();
      console.log(data);
      setimagesData(data);
    }
    fetchData();
  }, []);
  return (
    <div
      style={{
        marginTop: "40px",
        justifyContent: "space-around",
        display: "flex",
        flexWrap: "wrap",
        width: "90%",
        margin: "auto",
      }}
    >
      {imagesData?.map((image, i) => {
        return (
          <div
            key={i}
            style={{
              width: "400px",
              height: "330px",
              border: "2px solid #000000",
              margin: "30px 10px",
            }}
          >
            <div style={{ padding: "5px 10px" }}>
              <p style={{ fontWeight: "bold", textTransform: "capitalize" }}>
                {image.author}
              </p>
            </div>
            <img
              style={{ height: "300px", width: "300px" }}
              alt="pokemon"
              src={image.download_url}
            />
          </div>
        );
      })}
    </div>
  );
};

export default RandomImages;
