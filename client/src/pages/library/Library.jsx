// import { useEffect } from "react";
import Navbar from "../../components/Navbar";
import "./Library.css";
import { Link } from "react-router-dom";
// import { getChoices } from "../../services/choicesApi";
const Library = () => {
  //   useEffect(() => {
  //     getChoices({ model: "user, transaction" })
  //       .then((response) => {
  //         console.log("Choices fetched:", response);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching choices:", error);
  //       });
  //   }, []);
  return (
    <div className="library-container">
      <Navbar />
    </div>
  );
};

export default Library;
