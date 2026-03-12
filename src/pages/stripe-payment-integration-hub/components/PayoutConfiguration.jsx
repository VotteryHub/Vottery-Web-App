import React from 'react';
import PayoutSettings from '../../../pages/digital-wallet-hub/components/PayoutSettings';

const PayoutConfiguration = ({ settings, onUpdate }) => {
  return (
    <div>
      <PayoutSettings settings={settings} onUpdate={onUpdate} />
    </div>
  );
};

export default PayoutConfiguration;