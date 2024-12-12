import { Routes, Route, Navigate } from "react-router-dom";
import PageLogin from "../pages/PageLogin";
import PageMenuDeAcesso from "../pages/PageMenuDeAcesso";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/pageLogin" element={<PageLogin />} />
      <Route path="/pageMenuDeAcesso" element={<PageMenuDeAcesso />} />
      <Route path="*" element={<Navigate to="/pageLogin" />} />{" "}
    </Routes>
  );
};
