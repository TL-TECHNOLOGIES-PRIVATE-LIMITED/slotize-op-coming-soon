import { useEffect, useState } from 'react';
import './App.css'
import ComingSoonPage from './ComingSoon'
import Preloader from './Preloader';


function App() {

  const [loading, setLoading] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => setLoading(false), 2000); 
  return () => clearTimeout(timer);
}, []);

  return (

    <div >
      {loading ? <Preloader /> :  <ComingSoonPage/>}
    </div>
  )
}

export default App
