import { useEffect, useState } from "react";

interface ModuleItem {
  content: string;
  university: string;
  degree_program: string;
  module_code: number;
  ects: string;
  degree_level: string;
  module_name: string;
  type: string;
}

interface ModuleData {
  message: string;
  total_items: number;
  total_results: number;
  items: ModuleItem[];
}

export default function ModuleList() {
  const [moduleData, setModuleDatas] = useState<ModuleData | null>(null);

  const jwtToken = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/user/profile/list", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((response) => response.json())
      .then((data: ModuleData) => {
        setModuleDatas(data);
      })
      .catch((error) => {
        console.error("Error fetching studunt list data:", error);
      });
  }, []);

  return (
    <div className="about-thumb bg-white shadow-lg">
      <h5 className="mb-3" style={{ color: "#1e5af5" }}>
        Module List
      </h5>
      <div className="search-header">
        <div className="search-column">
          <strong>Module Code</strong>
        </div>
        <div className="search-column">
          <strong>Module Name</strong>
        </div>
        <div className="search-column">
          <strong>ECTS Credits</strong>
        </div>
        <div className="search-column">
          <strong>Degree Level</strong>
        </div>
        <div className="search-column">
          <strong>Module Type</strong>
        </div>
        <div className="search-column">
          <strong>University</strong>
        </div>
      </div>
      {/*Display No Item*/}
      {!moduleData?.items && (
        <h2 style={{ textAlign: "center", color: "red", marginTop: "15px" }}>
          {" "}
          {moduleData && moduleData.message}{" "}
        </h2>
      )}
      {/*Display Items*/}
      {moduleData ? (
        <div className="search-table">
          {moduleData.items.map((item, index) => (
            <div className="search-row" key={index}>
              <div className="search-column" id="moduleCode">
                {item.module_code}
              </div>
              <div className="search-column" id="moduleName">
                {item.module_name}
              </div>
              <div className="search-column" id="ect">
                {item.ects}
              </div>
              <div className="search-column" id="degree">
                {item.degree_level}
              </div>
              <div className="search-column" id="type">
                {item.type}
              </div>
              <div className="search-column" id="university">
                {item.university}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No data</p>
      )}
      ;
    </div>
  );
}
