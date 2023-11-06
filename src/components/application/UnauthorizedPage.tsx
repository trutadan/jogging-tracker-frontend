import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div>
      <h2>401 - Unauthorized</h2>
      <p>You do not have permission to access this page.</p>
      <Link to="/">Go to the Main Page</Link>
    </div>
  );
};

export default UnauthorizedPage;