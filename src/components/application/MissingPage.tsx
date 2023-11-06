import { Link } from 'react-router-dom';

const MissingPage = () => {
  return (
    <div>
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Go to the Main Page</Link>
    </div>
  );
};

export default MissingPage;
