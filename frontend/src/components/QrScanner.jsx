import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

// Component that handles the QR Code scanning logic
const QrScanner = ({ onScanSuccess }) => {
  // 1. Ref to hold the ID of the HTML element where the scanner will be rendered
  const qrcodeRegionId = useRef('html5qr-code-full-region').current;

  // 2. State for controlling the scanner and showing messages
  const [scannerActive, setScannerActive] = useState(true);

  useEffect(() => {
    if (!scannerActive) return;

    // 3. Create a new Html5QrcodeScanner instance
    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      { 
        fps: 10,
        qrbox: { width: 250, height: 250 },
        // Use the back camera by default for mobile devices
        preferredCamera: { facingMode: "environment" }
      },
      /* verbose= */ false
    );

    // 4. Define the success callback function
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      // Logic to run upon successful scan
      console.log(`Scan successful! Result: ${decodedText}`);
      
      // Stop the scanner to prevent further scans
      html5QrcodeScanner.clear().then(() => {
        setScannerActive(false);
        // 5. Call the prop function to update the parent state
        onScanSuccess(decodedText); 
      }).catch((error) => {
        console.error("Failed to clear html5QrcodeScanner.", error);
      });
    };

    // 6. Define the error callback (optional)
    const qrCodeErrorCallback = (errorMessage) => {
      // You can display this error to the user if needed
      // console.warn(`QR Code Scan Error: ${errorMessage}`);
    };

    // 7. Render the scanner
    html5QrcodeScanner.render(qrCodeSuccessCallback, qrCodeErrorCallback);

    // 8. Cleanup function to stop the scanner when the component unmounts
    return () => {
      if (scannerActive) {
        html5QrcodeScanner.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner on unmount.", error);
        });
      }
    };
  }, [onScanSuccess, scannerActive]); // Depend on onScanSuccess and scannerActive

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {scannerActive ? (
        <>
          <h3>Hold a QR Code up to the Camera</h3>
          {/* This is the element where the camera feed will be rendered */}
          <div id={qrcodeRegionId} style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}></div>
        </>
      ) : (
        <h3>Scan Complete!</h3>
      )}
    </div>
  );
};

export default QrScanner;