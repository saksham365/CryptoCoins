"use client";
import React from 'react';
import './BuyButton.css';

const BuyButton = ({ buttonText = 'Buy' }) => {
    const exchanges = [
        { name: 'WazirX', url: 'https://wazirx.com' },
        { name: 'CoinDCX', url: 'https://coindcx.com' },
        { name: 'CoinSwitch', url: 'https://coinswitch.co' },
        { name: 'ZebPay', url: 'https://zebpay.com' },
        { name: 'Bitbns', url: 'https://bitbns.com' }
    ];

    return (
        <div className="buy-btn-container" onClick={(e) => e.stopPropagation()}>
            <button className="buy-btn">{buttonText}</button>
            <div className="dropdown-content">
                {exchanges.map((ex) => (
                    <a key={ex.name} href={ex.url} target="_blank" rel="noopener noreferrer">
                        {ex.name}
                    </a>
                ))}
            </div>
        </div>
    );
};

export default BuyButton;
