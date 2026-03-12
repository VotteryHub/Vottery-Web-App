import React, { useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { HelpCircle } from 'lucide-react';

function Icon({
    name,
    size = 24,
    color = "currentColor",
    className = "",
    strokeWidth = 2,
    ...props
}) {
    const IconComponent = LucideIcons?.[name];

    if (!IconComponent) {
        return <HelpCircle size={size} color="gray" strokeWidth={strokeWidth} className={className} {...props} />;
    }

    return <IconComponent
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        className={className}
        {...props}
    />;
}
export default Icon;
const FileText = () => {
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.warn('Placeholder: FileText is not implemented yet.');
  }, []);
  return (
    <div>
      {/* FileText placeholder */}
    </div>
  );
};

export { FileText };
const Clock = () => {
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.warn('Placeholder: Clock is not implemented yet.');
  }, []);
  return (
    <div>
      {/* Clock placeholder */}
    </div>
  );
};

export { Clock };
const Zap = () => {
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.warn('Placeholder: Zap is not implemented yet.');
  }, []);
  return (
    <div>
      {/* Zap placeholder */}
    </div>
  );
};

export { Zap };
const Radio = () => {
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.warn('Placeholder: Radio is not implemented yet.');
  }, []);
  return (
    <div>
      {/* Radio placeholder */}
    </div>
  );
};

export { Radio };