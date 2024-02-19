import { useEffect, useState } from "react";

interface StudInfo {
  first_name: string;
  last_name: string;
  email: string;
  registration_number: string; //for the student
  course_of_study: string;
  semester: string;
}

interface StudInfoData {
  total_results: number;
  total_items: number;
  items: StudInfo[];
}

export default function StudList() {
  const [studInfoData, setStudInfoDatas] = useState<StudInfoData | null>(null);
  const jwtToken = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    // Fetch user profile data
    fetch("http://localhost:8000/api/v1/user/profile/list", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((response) => response.json())
      .then((data: StudInfoData) => {
        setStudInfoDatas(data);
      })
      .catch((error) => {
        console.error("Error fetching studunt list data:", error);
      });
  }, []);

  return (
    <div className="about-thumb bg-white shadow-lg">
      <h5 className="mb-3" style={{ color: "#1e5af5" }}>
        Student List
      </h5>
      <div className="search-header">
        <div className="search-column">
          <strong>Name and Surname</strong>
        </div>
        <div className="search-column">
          <strong>Registrarion Nr.</strong>
        </div>
        <div className="search-column">
          <strong>Course of study</strong>
        </div>
        <div className="search-column">
          <strong>Study semester</strong>
        </div>
      </div>
      {/*Display No Item*/}
      {/* {!props.searchResult.items && (
        <h2 style={{ textAlign: "center", color: "red", marginTop: "15px" }}>
          {" "}
          {props.searchResult.message}{" "}
        </h2>
      )} */}
      {/*Display Items*/}
      {studInfoData ? (
        <div className="search-table">
          {studInfoData.items.map((studInfo) => (
            <div className="search-row" key={studInfo.email}>
              <div className="search-column" id="name">
                {studInfo.first_name + " " + studInfo.last_name}
              </div>
              <div className="search-column" id="registrationNr">
                {studInfo.registration_number}
              </div>
              <div className="search-column" id="sourse">
                {studInfo.course_of_study}
              </div>
              <div className="search-column" id="semester">
                {studInfo.semester}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
