import React from 'react';
import HomePage from './HomePage';
import StudentProfilePage from './StudentProfilepage';

type ContentProps = {
    displayPage: string;
    userName: string;
};

const Content: React.FC<ContentProps> = (props) => {
    let pageComponent;

    switch (props.displayPage) {
        case 'home':
            pageComponent = <HomePage />;
            break;
        case 'studentProfile':
            pageComponent = <StudentProfilePage />;
            break;
        default:
            pageComponent = <div>Page not found</div>;
    }

    return <>{pageComponent}</>;
};

export default Content;