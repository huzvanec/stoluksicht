import React from 'react';


const Logo: React.FC<React.SVGProps<SVGSVGElement>> = ({...other}) => {
    return (
        <svg {...other}>
            <text x="50%" y="50%">
                STOLUJEME
            </text>
        </svg>
    );
};
export default Logo;