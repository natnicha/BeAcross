import personalplanImage from "../images/projects/personal-plan.png";
import examResultImage from "../images/projects/exam-result.png";
import editProfileImage from "../images/projects/edit-profile.png";
import { Link } from "react-router-dom";

export default function SubMenu1() {
  return (
    <>
      <button className="nav-link active" id="personalplan">
        <img
          src={personalplanImage}
          className="img-fluid projects-image"
          alt="Personal Plan"
        />
        <Link to="../upload" className="click-scroll">
          <i className="bi bi-bookmark"></i>{" "}
          <strong> &nbsp; Upload Modules</strong>
        </Link>
        <br />
        <Link to="../list" className="click-scroll">
          <i className="bi bi-bookmark"></i>{" "}
          <strong> &nbsp; Module List</strong>
        </Link>
      </button>

      <button className="nav-link active" id="examresult">
        <img
          src={examResultImage}
          className="img-fluid projects-image"
          alt="Exam Result"
        />
        <Link to="../create" className="click-scroll">
          <i className="bi bi-bookmark"></i>{" "}
          <strong> &nbsp; Create Student Account</strong>
        </Link>
        <br />
        <Link to="../studlist" className="click-scroll">
          <i className="bi bi-bookmark"></i>{" "}
          <strong> &nbsp; Student List</strong>
        </Link>
      </button>

      <button className="nav-link active" id="editprofile">
        <img
          src={editProfileImage}
          className="img-fluid projects-image"
          alt="Edit Profile"
        />
        <Link to="../profile" className="click-scroll">
          <i className="bi bi-file-earmark-text"></i>{" "}
          <strong> &nbsp; Edit Profile</strong>
        </Link>
      </button>
    </>
  );
}
