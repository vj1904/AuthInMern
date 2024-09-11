import styles from "./styles.module.css";
import React from "react";
import success from "../../images/success.png";
import { useState, useEffect, Fragment } from "react";
import { Link, useParams } from "react-router-dom";
import { baseUrl } from "../../Urls";
import axios from "axios";

const EmailVerify = () => {
  const [validUrl, setValidUrl] = useState(false);
  const [verificationChecked, setVerificationChecked] = useState(false);
  const { id, token } = useParams();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `${baseUrl}/api/users/${id}/verify/${token}`;
        const { data } = await axios.get(url);
        setValidUrl(true);
        console.log("Verification successful:", data);
      } catch (error) {
        console.log(
          "Verification failed:",
          error.response?.data || error.message
        );
        setErrorMessage(error.message);
      } finally {
        setVerificationChecked(true); // Set to true after verification attempt
      }
    };

    if (!verificationChecked) {
      verifyEmailUrl();
    }
  }, []);
  return (
    <Fragment>
      {verificationChecked &&
        (validUrl ? (
          <div className={styles.container}>
            <img
              src={success}
              alt="success_img"
              className={styles.success_img}
            />
            <h1>Email verified successfully</h1>
            <Link to="/login">
              <button className={styles.green_btn}>Login</button>
            </Link>
          </div>
        ) : (
          <h1>{errorMessage || "404 Not Found"}</h1>
        ))}
    </Fragment>
  );
};

export default EmailVerify;
