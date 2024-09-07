import styles from "./styles.module.css";
import React from "react";
import success from "../../images/success.png";
import { useState, useEffect, Fragment } from "react";
import { Link, useParams } from "react-router-dom";
import { baseUrl } from "../../Urls";

const EmailVerify = () => {
  const [validUrl, setValidUrl] = useState(false);
  const param = useParams();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `${baseUrl}/api/users/${params.id}/verify/${params.token}`;
        const { data } = await axios.get(url);
        setValidUrl(true);
      } catch (error) {
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, [param]);
  return (
    <Fragment>
      {validUrl ? (
        <div className={styles.container}>
          <img src={success} alt="success_img" className={styles.success_img} />
          <h1>Email verified successfully</h1>
          <Link to="/login">
            <button className={styles.green_btn}>Login</button>
          </Link>
        </div>
      ) : (
        <h1>404 Not Found</h1>
      )}
    </Fragment>
  );
};

export default EmailVerify;
