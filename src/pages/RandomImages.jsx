import React, { useEffect, useState } from "react";
import { getAllImagesList } from "../api/randomImages";

const RandomImages = () => {
  const [imagesData, setImagesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getAllImagesList();
      setImagesData(data);
      setLoading(false);
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
      {loading && (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      )}
      {!loading &&
        imagesData.map((image, i) => (
          <div
            key={i}
            style={{
              width: "400px",
              height: "330px",
              border: "2px solid #000000",
              margin: "30px 10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ padding: "5px 10px", alignSelf: "flex-start" }}>
              <p style={{ fontWeight: "bold", textTransform: "capitalize" }}>
                {image.author}
              </p>
            </div>
            <div
              style={{
                height: "250px",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                style={{ maxHeight: "100%", maxWidth: "100%" }}
                alt="pokemon"
                src={image.download_url}
                onLoad={() => setLoading(false)}
              />
            </div>
          </div>
        ))}
    </div>
  );
};

export default RandomImages;
