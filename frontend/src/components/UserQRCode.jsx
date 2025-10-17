import React, { useRef, useMemo, useCallback } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const getQRCodeData = () => {
  const userString = localStorage.getItem('user');
  let userData = {};

  try {
    userData = userString ? JSON.parse(userString) : {};
  } catch (e) {
    console.error("Error parsing user data:", e);
    return { error: 'Invalid user data' };
  }

  const { 
    _id, 
    name = 'Resident', 
    email, 
    role, 
    address 
  } = userData;

  const dataForQR = {
    _id, 
    name, 
    email, 
    role, 
    address
  };
  
  return JSON.stringify(dataForQR);
};

const UserQRCode = () => {
  const qrRef = useRef(null);
  
  const qrDataString = useMemo(() => getQRCodeData(), []);

  if (qrDataString.includes('Invalid user data')) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline ml-2">Could not load user data for QR code.</span>
      </div>
    );
  }

  const downloadQRCode = useCallback(() => {
    const canvas = qrRef.current.querySelector('canvas');

    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream'); 

      let downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${JSON.parse(qrDataString).name || 'User'}_QR_Code.png`; 

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  }, [qrDataString]);

  const userName = JSON.parse(qrDataString).name || 'Resident';

  return (
    <div className="
      flex flex-col items-center 
      p-6 md:p-8 bg-white shadow-lg rounded-xl 
      max-w-md mx-auto my-10 
      border border-gray-200
    ">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">
        Your Personal QR Code
      </h3>
      
      <div 
        ref={qrRef} 
        className="
          p-4 bg-white rounded-lg shadow-md mb-6 
          flex items-center justify-center 
          border border-gray-100
        "
      >
        <QRCodeCanvas 
          value={qrDataString}
          size={256}
          level="H"
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>

      <p className="text-gray-700 text-center mb-4 text-lg">
        This QR code contains your essential information:
        <br/><strong className="text-blue-600">{userName}</strong>
      </p>

      <button 
        onClick={downloadQRCode}
        className="
          w-full px-6 py-3 bg-blue-600 text-white font-semibold 
          rounded-lg shadow-md hover:bg-blue-700 transition-colors 
          duration-300 ease-in-out focus:outline-none focus:ring-2 
          focus:ring-blue-500 focus:ring-opacity-75 text-lg
        "
      >
        Download QR Code (PNG)
      </button>

      <p className="text-sm mt-4 text-gray-500 text-center">
        *Includes ID, Name, Email, Role, and Address for quick access.
        <br/>Keep it safe!
      </p>
    </div>
  );
};

export default UserQRCode;