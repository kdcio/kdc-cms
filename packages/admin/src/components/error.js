import React from 'react';
import { Link } from '@reach/router';

const Error404 = () => (
  <div className="d-flex vh-100 justify-content-center flex-column">
    <div className="text-center">
      <div className="error mx-auto" data-text="404">
        404
      </div>
      <p className="lead text-gray-800 mb-5">Page Not Found</p>
      <p className="text-gray-500 mb-0">It looks like you found a glitch in the matrix...</p>
      <Link to="/">&larr; Back to Dashboard</Link>
    </div>
  </div>
);

export default Error404;
