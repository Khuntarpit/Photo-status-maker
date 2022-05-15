import "./App.css";
import { Routes, Route } from "react-router-dom";
import CategoryItem from "./Componets/CategoryItem";
import SubCategoryItem from "./Componets/SubCategoryItem";
import QuoteItem from "./Componets/QuoteItem";

function App() {
  return (
    <Routes>
      <Route path="/" />
      <Route path="/category" element={<CategoryItem/>} />
      <Route path="/subcategory" element={<SubCategoryItem/>} />
      <Route path="/quote" element={<QuoteItem/>} />
    </Routes>
  );
}

export default App;
