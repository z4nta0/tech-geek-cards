import { useEffect, useState } from "react";
import MothersDayCard from "./MothersDayCard.tsx";



// Entry point or Root component
function MothersDayCardWrapper() {
  const [remountKey, setRemountKey] = useState(0);

  useEffect(() => {
    const handleResize = () => setRemountKey(prev => prev + 1);
    screen.orientation.addEventListener("change", handleResize);
    return () => screen.orientation.removeEventListener('change', handleResize);
  }, []);

  // When remountKey changes, the Parent AND all its children will remount
  return <MothersDayCard key={remountKey} />;
}

export default MothersDayCardWrapper;