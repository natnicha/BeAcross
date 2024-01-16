import React from 'react';
import './App.css';
import './bootstrap.min.css';
import './bootstrap-icons.css';
import './magnific-popup.css';
import './tooplate-waso-strategy.css';

import Header from './Header';
import Content from './Content';
import Footer from './Footer';

const App: React.FC = () => {

  const homePage = "home";
  const studentProfilePage = "studentProfile";
  
  return (
      <>
        <Header />
        <Content displayPage={studentProfilePage} userName="" />
        <Footer />
      </>
  );
};

export default App;
