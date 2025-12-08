import { NavLink } from "react-router-dom";

function LinkRedirecionavel({ nome, link, className }) {
  return (
    <NavLink
      to={link}
      className={({ isActive }) =>
        `${className} ${isActive ? "bg-[var(--primary)] text-white" : ""
        }`
      }
    >
      {nome}
    </NavLink>
  );
}

export default LinkRedirecionavel;
