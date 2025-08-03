import { createContext, useState } from "react";
import { Routes, Route } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
export const GlobalContext = createContext();

function StartTour() {
  return <div>Start Tour</div>;
}

function EndTour() {
  return <div>End Tour</div>;
}

function App() {
  const [state, setState] = useState({});

  return (
    <GlobalContext.Provider value={{ state, setState }}>
      <Routes>
        <Route path="/start-tour" element={<StartTour />} />
        <Route path="/end-tour" element={<EndTour />} />
      </Routes>
    </GlobalContext.Provider>
  );
}

export default App;

