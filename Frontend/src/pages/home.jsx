import Maps from "../components/Maps";
import WhereTo from "../components/WhereTo";
import { useState } from "react";
const Home = () => {
  const [routeCoords, setRouteCoords] = useState([]);

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {/* <Header /> */}
      <Maps
        routeCoords={routeCoords}
        // style={{ width: "100%", height: "100%" }} // Adjust the width and height here
      />

      <WhereTo setRouteCoords={setRouteCoords} />
    </div>
  );
};

export default Home;
