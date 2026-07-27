import React from "react";
import "./AnimatedCheckmark.scss";

export default function AnimatedCheckmark() {
  return (
    <svg
      className="animated-checkmark"
      viewBox="0 0 52 52"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle className="animated-checkmark__circle" cx="26" cy="26" r="24" fill="none" />
      <path className="animated-checkmark__check" fill="none" d="M14 27l7 7 16-16" />
    </svg>
  );
}
