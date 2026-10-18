import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import { Provider } from "react-redux";
import { store } from "./Stores/store";
import { BrowserRouter } from 'react-router';
import { GoogleOAuthProvider } from '@react-oauth/google';



ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
    
      <BrowserRouter>
    <App />
    </BrowserRouter>
    </GoogleOAuthProvider>
  </Provider>

  
);
