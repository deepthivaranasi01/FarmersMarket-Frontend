import {BrowserRouter} from "react-router-dom";
import {Routes, Route, Navigate} from "react-router";
import FarmersMarket from "./FM"

function App() {
  return (
    
    <BrowserRouter>
      <div className="container" >
        <Routes>
        <Route path="/"         element={< Navigate to="/FarmersMarket/home"/>}/>
          <Route path="/FarmersMarket/*" element={<FarmersMarket/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;