import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Home } from "./pages/Home"
import { Register } from "./pages/Register"
import { Search } from "./pages/Search"
import "../sass/app.scss";

ReactDOM.render(
    <BrowserRouter>
        <Routes>
        <Route path="/">
            <Route index element={<Home />} />
            <Route path="/cadastrar" element={<Register />}/>
            <Route path="/pesquisar" element={<Search />}/>
        </Route>
        </Routes>
    </BrowserRouter>,
  document.getElementById("root")
);
