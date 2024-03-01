import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "initial" | "uploading" | "success" | "fail"
  >("initial");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setStatus("initial");
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file?.type === "application/json") {
      setStatus("uploading");

      const formData = new FormData();
      formData.append("file", file);

      try {
        const result = await fetch("http://localhost:8000/api/v1/module", {
          method: "POST",
          body: formData,
        });

        const data = await result.json();

        console.log(data);
        setStatus("success");
      } catch (error) {
        console.error(error);
        setStatus("fail");
      }
    } else {
      alert("File type not supported. Please upload a JSON file.");
    }
  };

  return (
    <>
      <div className="about-thumb bg-white shadow-lg">
        <div className="d-flex flex-column">
          <label htmlFor="file" className="sr-only form-label">
            <strong>Upload University Modules (format *.json only)</strong>
          </label>
          <input
            className="form-control"
            id="file"
            type="file"
            onChange={handleFileChange}
          />
          {file && (
            <section>
              <ul style={{ listStyle: "none" }}>
                <li>Name: {file.name}</li>
                {/* <li>Type: {file.type}</li>
              <li>Size: {file.size} bytes</li> */}
              </ul>
            </section>
          )}
        </div>

        {file && (
          <button onClick={handleUpload} className="submit custom-btn btn">
            Upload
          </button>
        )}

        <Result status={status} />
      </div>
    </>
  );
};

const Result = ({ status }: { status: string }) => {
  const navigate = useNavigate();

  if (status === "success") {
    return (
      <>
        <p>✅ File uploaded successfully!</p>
      </>
    );
  } else if (status === "fail") {
    return (
      <button
        className="custom-btn btn custom-link"
        onClick={() => navigate("../list")}
      >
        Module List
      </button>
    );
  } else if (status === "uploading") {
    return <p>⏳ Uploading selected file...</p>;
  } else {
    return null;
  }
};

export default FileUploader;
