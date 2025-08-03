import { createContext, useState } from "react";
import { Routes, Route } from "react-router-dom";
import StartTourForm from "./components/StartTourForm";

// eslint-disable-next-line react-refresh/only-export-components
export const GlobalContext = createContext();

function EndTour() {
  return <div>End Tour</div>;
}

function App() {
  const [state, setState] = useState({});

  return (
    <GlobalContext.Provider value={{ state, setState }}>
      <Routes>
        <Route path="/start-tour" element={<StartTourForm />} />
        <Route path="/end-tour" element={<EndTour />} />
      </Routes>
    </GlobalContext.Provider>
  );
}

export default App;

