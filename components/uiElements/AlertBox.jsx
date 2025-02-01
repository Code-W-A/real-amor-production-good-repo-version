import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const AlertBox = ({ type, message, showAlert, onClose }) => {
  const [visible, setVisible] = useState(showAlert);

  useEffect(() => {
    if (showAlert) {
      setVisible(true);
      // Set timeout to close the alert after 2.5 seconds
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 2500);

      // Cleanup timeout on unmount or on props change
      return () => clearTimeout(timer);
    }
  }, [showAlert, onClose]);

  if (!visible) return null;

  return (
    <div
      className={`alert alert-${type} alert-dismissible fade show`}
      role="alert"
      style={{
        position: "fixed", // Fixează alerta în raport cu fereastra
        bottom: "20px", // Plasează alerta la 20px de marginea inferioară
        left: "50%",
        transform: "translateX(-50%)", // Centrează alerta pe orizontală
        zIndex: 9999, // Asigură că alerta este deasupra altor elemente
        width: "auto", // Lățime automată în funcție de text
        maxWidth: "90%", // Limitează lățimea pe ecrane mici
        padding: "15px 30px", // Adaugă spațiu în jurul textului
        backgroundColor:
          type === "success"
            ? "rgba(40, 167, 69, 0.9)" // Transparență pentru succes
            : type === "danger"
            ? "rgba(220, 53, 69, 0.9)" // Transparență pentru eroare
            : "rgba(23, 162, 184, 0.9)", // Transparență pentru info
        color: "#fff", // Text alb
        borderRadius: "8px", // Colțuri rotunjite pentru un aspect modern
        textAlign: "center",
        backdropFilter: "blur(10px)", // Efect de blur pentru fundal
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Umbră pentru adâncime
      }}
    >
      <span>{message}</span>
      <button
        type="button"
        className="btn-close"
        aria-label="Close"
        onClick={() => setVisible(false)}
        style={{
          marginLeft: "15px", // Adaugă spațiu între text și buton
          color: "white", // Schimbă culoarea butonului de închidere
          opacity: "1",
          // Asigură vizibilitatea butonului
        }}
      ></button>
    </div>
  );
};

// Prop types to validate props
AlertBox.propTypes = {
  type: PropTypes.oneOf(["success", "info", "danger"]).isRequired,
  message: PropTypes.string.isRequired,
  showAlert: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AlertBox;
