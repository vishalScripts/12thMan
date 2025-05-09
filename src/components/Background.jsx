import React from 'react';

const Background = ({className}) => {
    return (
        <div className={`fixed -z-10  ${className}`} style={{
                background:
                  "linear-gradient(to bottom right, var(--acme-background), var(--acme-background))",
                color: "var(--acme-text)",
              }}>
            <img className='w-screen content-center object-cover opacity-5 saturate-0 h-screen bg-repeat' src="src/assets/ttten.svg" alt="" srcset="" />
        </div>
    );
};

export default Background;  