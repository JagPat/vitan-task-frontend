// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';

export function Card({ className = '', children, ...props }) {
  return (
    <div className={`bg-white rounded-lg shadow ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children, ...props }) {
  return (
    <h3 className={`text-lg font-medium text-gray-900 ${className}`} {...props}>{children}</h3>
  );
}

export function CardContent({ className = '', children, ...props }) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};
CardHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};
CardTitle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};
CardContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};


