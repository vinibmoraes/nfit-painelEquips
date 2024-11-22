import { Routes, Route, Navigate } from "react-router-dom";
import PageLogin from "../pages/pageLogin";
import PageMenuDeAcesso from "../pages/pageMenuDeAcesso";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/pageLogin" element={<PageLogin />} />
      <Route path="/pageMenuDeAcesso" element={<PageMenuDeAcesso />} />
      <Route path="*" element={<Navigate to="/pageLogin" />} />{" "}
    </Routes>
  );
};
