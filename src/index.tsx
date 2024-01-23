import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import './index.css';
import {App} from './App';
import PatchReview from './PatchReview';
import NewPatch from './NewPatch';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/e/:id",
    element: <PatchReview />
  },
  {
    path: "/new/:naddr",
    element: <NewPatch />
  }
]);
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
