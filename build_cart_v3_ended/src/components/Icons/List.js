import React from "react";

export default function ListIcon({
  fill = "#fff",
  width = "16",
  height = "16",
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M10.7959 1.33398H5.20927C2.7826 1.33398 1.33594 2.78065 1.33594 5.20732V10.794C1.33594 13.2207 2.7826 14.6673 5.20927 14.6673H10.7959C13.2226 14.6673 14.6693 13.2207 14.6693 10.794V5.20732C14.6693 2.78065 13.2226 1.33398 10.7959 1.33398ZM6.64927 9.93398L5.14927 11.434C5.04927 11.534 4.9226 11.5807 4.79594 11.5807C4.66927 11.5807 4.53594 11.534 4.4426 11.434L3.9426 10.934C3.7426 10.7407 3.7426 10.4207 3.9426 10.2273C4.13594 10.034 4.44927 10.034 4.64927 10.2273L4.79594 10.374L5.9426 9.22732C6.13594 9.03398 6.44927 9.03398 6.64927 9.22732C6.8426 9.42065 6.8426 9.74065 6.64927 9.93398ZM6.64927 5.26732L5.14927 6.76732C5.04927 6.86732 4.9226 6.91398 4.79594 6.91398C4.66927 6.91398 4.53594 6.86732 4.4426 6.76732L3.9426 6.26732C3.7426 6.07398 3.7426 5.75398 3.9426 5.56065C4.13594 5.36732 4.44927 5.36732 4.64927 5.56065L4.79594 5.70732L5.9426 4.56065C6.13594 4.36732 6.44927 4.36732 6.64927 4.56065C6.8426 4.75398 6.8426 5.07398 6.64927 5.26732ZM11.7093 11.0807H8.20927C7.93594 11.0807 7.70927 10.854 7.70927 10.5807C7.70927 10.3073 7.93594 10.0807 8.20927 10.0807H11.7093C11.9893 10.0807 12.2093 10.3073 12.2093 10.5807C12.2093 10.854 11.9893 11.0807 11.7093 11.0807ZM11.7093 6.41398H8.20927C7.93594 6.41398 7.70927 6.18732 7.70927 5.91398C7.70927 5.64065 7.93594 5.41398 8.20927 5.41398H11.7093C11.9893 5.41398 12.2093 5.64065 12.2093 5.91398C12.2093 6.18732 11.9893 6.41398 11.7093 6.41398Z"
        fill={fill}
      />
    </svg>
  );
}
