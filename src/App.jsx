import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
   import LandingPage from './pages/LandingPage'; // your main component
   import Terms from './pages/Terms';
   import Privacy from './pages/Privacy';
   import Refund from './pages/Refund';

   export default function App() {
     return (
       <Router>
         <Routes>
           <Route path="/" element={<LandingPage />} />
           <Route path="/terms" element={<Terms />} />
           <Route path="/privacy" element={<Privacy />} />
           <Route path="/refund" element={<Refund />} />
         </Routes>
       </Router>
     );
   }