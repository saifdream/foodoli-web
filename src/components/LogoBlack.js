import React from 'react';

const Logo = (props) => {
    return (
        <img
            style={{height: 48, width: 150}}
            alt="Logo"
            src="/static/logo-black.png"
            {...props}
        />
    );
};

export default Logo;
