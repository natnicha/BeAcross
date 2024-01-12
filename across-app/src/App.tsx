import React from 'react';
import logo from './logo.svg';
import './App.css';
import './bootstrap.min.css';
import './bootstrap-icons.css';
import './magnific-popup.css';
import './tooplate-waso-strategy.css';

import Header from './Header';
import Content from './Content';
import Footer from './Footer';

const App: React.FC = () => {

  const page = "home"; // Make some logic here to determine what page to be rendered !!
  
  return (
      <>
        <Header />
        <Content displayPage={page} userName="" />
        <Footer />
      </>
  );
};

export default App;
