import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { routes } from '@generouted/react-router'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './main.css'

const router = createBrowserRouter(routes, { basename:"/CRISP/" })

createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)

