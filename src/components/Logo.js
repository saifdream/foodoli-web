import React from 'react';

const Logo = (props) => {
    return (
        <img
            style={{height: 58, width: 200}}
            alt="Logo"
            src="/static/logo.png"
            {...props}
        />
    );
};

export default Logo;
