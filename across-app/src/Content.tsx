import React from 'react';

type ContentProps = {
    displayPage: string;
    userName: string;
};

const Content: React.FC<ContentProps> = (props) => {

    const homePage = <div>Home Page</div>;
    const ssrPage = <div>SSR Page</div>;
    //const subjectPage = <SubjectPage />;

    return (
        <>
            {props.displayPage == "Home" ? homePage : ssrPage}
        </>


    );


};

export default Content;