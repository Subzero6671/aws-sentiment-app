import { Routes, Route, BrowserRouter as Switch, useNavigate, useLocation } from 'react-router-dom'
import App from './App';
import SearchDashboard from './SearchDashboard';

const Router = () => {

  
    return (
      <Switch>
        <Routes>
          <Route path="/" element={<App/>}/>
          <Route path="/searchDashboard" element={<SearchDashboard/>}/>
        </Routes>
      </Switch>
    )
  }
  
  export default Router;
  