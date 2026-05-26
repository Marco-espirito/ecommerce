import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Accueil from "./pages/Accueil";
import Catalogue from "./pages/Catalogue";
import ProductDetail from "./pages/ProductDetail";
import Panier from "./pages/Panier";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import MonCompte from "./pages/MonCompte";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Accueil />} />
          <Route path="catalogue" element={<Catalogue />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="panier" element={<Panier />} />
          <Route path="connexion" element={<Connexion />} />
          <Route path="inscription" element={<Inscription />} />
          <Route path="mon-compte" element={<MonCompte />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;