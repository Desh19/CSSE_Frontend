import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Camera,
  Upload,
  X,
  User,
  Mail,
  MapPin,
  Briefcase,
  Hash,
  CheckCircle,
  SwitchCamera,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import jsQR from "jsqr";
import { completePickupFunc } from "../services/api";

const QRCodeScanner = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pickupRequestId = location.state?.pickupRequestId;

  useEffect(() => {
    if (pickupRequestId) {
      console.log("Pickup Request ID:", pickupRequestId);
    } else {
      console.warn("No pickup request ID received");
    }
  }, [pickupRequestId]);

  const [scanMode, setScanMode] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const [isCompleting, setIsCompleting] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);

  const parseQRData = (data) => {
    try {
      const parsed = JSON.parse(data);
      return parsed;
    } catch (e) {
      return { raw: data };
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        scanQRCode();
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError(
        "Unable to access camera. Please ensure camera permissions are granted."
      );
      setIsScanning(false);
      setScanMode(null);
    }
  };

  const scanQRCode = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");

    const scan = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          const parsedData = parseQRData(code.data);
          setScannedData(parsedData);
          setIsScanning(false);
          stopCamera();
          setScanMode(null);
          return;
        }
      }

      animationFrameRef.current = requestAnimationFrame(scan);
    };

    scan();
  };

  const switchCamera = () => {
    stopCamera();
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  useEffect(() => {
    if (scanMode === "camera" && isScanning) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [scanMode, isScanning, facingMode]);

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          const parsedData = parseQRData(code.data);
          setScannedData(parsedData);
          setScanMode(null);
          setError(null);
        } else {
          setError("No QR code found in the image. Please try another image.");
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const resetScanner = () => {
    stopCamera();
    setScannedData(null);
    setError(null);
    setScanMode(null);
    setIsScanning(false);
  };

  const handleMarkAsComplete = async () => {
    if (!pickupRequestId) {
      setError("No pickup request ID available. Cannot complete pickup.");
      return;
    }

    setIsCompleting(true);
    setError(null);

    try {
      await completePickupFunc(pickupRequestId);
      console.log(`Pickup ${pickupRequestId} marked as complete successfully`);
      
      alert("Pickup completed successfully!");
      navigate(-1);
    } catch (err) {
      console.error(`Error completing pickup ${pickupRequestId}:`, err);
      setError(
        `Failed to complete pickup. ${
          err.response?.data?.message || "Please try again."
        }`
      );
    } finally {
      setIsCompleting(false);
    }
  };

  const getIconForField = (key) => {
    switch (key) {
      case "_id":
        return <Hash className="w-5 h-5" />;
      case "name":
        return <User className="w-5 h-5" />;
      case "email":
        return <Mail className="w-5 h-5" />;
      case "role":
        return <Briefcase className="w-5 h-5" />;
      case "address":
        return <MapPin className="w-5 h-5" />;
      default:
        return <Hash className="w-5 h-5" />;
    }
  };

  const formatFieldName = (key) => {
    if (key === "_id") return "ID";
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            QR Code Scanner
          </h1>
          <p className="text-gray-600 text-lg">
            Scan or upload a QR code to view user information
          </p>
          
        </div>

        {/* Main Content */}
        {!scanMode && !scannedData && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Camera Scan Option */}
              <button
                onClick={() => {
                  setScanMode("camera");
                  setIsScanning(true);
                  setError(null);
                }}
                className="group relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-8 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <div className="relative z-10">
                  <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-colors">
                    <Camera className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Scan with Camera</h3>
                  <p className="text-indigo-100">
                    Use your device camera to scan QR codes in real-time
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Upload Option */}
              <label className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-8 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="relative z-10">
                  <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-colors">
                    <Upload className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Upload Image</h3>
                  <p className="text-purple-100">
                    Select an image file containing a QR code from your device
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </label>
            </div>
          </div>
        )}

        {/* Camera Scanner */}
        {scanMode === "camera" && !scannedData && (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Scanning...</h2>
              <div className="flex gap-2">
                <button
                  onClick={switchCamera}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Switch Camera"
                >
                  <SwitchCamera className="w-6 h-6 text-gray-600" />
                </button>
                <button
                  onClick={resetScanner}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-square max-w-md mx-auto">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Scanning Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-8 border-4 border-white/50 rounded-xl" />
                <div className="absolute top-8 left-8 w-8 h-8 border-t-4 border-l-4 border-indigo-500 rounded-tl-xl" />
                <div className="absolute top-8 right-8 w-8 h-8 border-t-4 border-r-4 border-indigo-500 rounded-tr-xl" />
                <div className="absolute bottom-8 left-8 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl-xl" />
                <div className="absolute bottom-8 right-8 w-8 h-8 border-b-4 border-r-4 border-indigo-500 rounded-br-xl" />
              </div>
            </div>

            <p className="text-center text-gray-600 mt-6">
              Position the QR code within the frame
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-start">
              <X className="w-6 h-6 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-red-900 font-semibold mb-1">Error</h3>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={resetScanner}
                  className="mt-3 text-red-600 hover:text-red-800 font-medium underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Scanned Data Display */}
        {scannedData && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 sm:p-8 text-white">
              <div className="flex items-center justify-center mb-3">
                <CheckCircle className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold text-center mb-2">
                QR Code Scanned Successfully!
              </h2>
              <p className="text-green-100 text-center">
                User information retrieved
              </p>
            </div>

            {/* User Data */}
            <div className="p-6 sm:p-8">
              {scannedData.raw ? (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                    Raw Data:
                  </h3>
                  <p className="text-gray-700 break-all font-mono text-sm bg-white p-4 rounded-lg">
                    {scannedData.raw}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(scannedData)
                    .filter(([key]) => key !== "_id") 
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-start p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mr-4">
                          {getIconForField(key)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                            {formatFieldName(key)}
                          </p>
                          <p className="text-lg text-gray-900 break-words">
                            {value || "N/A"}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={resetScanner}
                  className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all"
                >
                  Scan Another QR Code
                </button>
                <button
                  onClick={handleMarkAsComplete}
                  disabled={isCompleting || !pickupRequestId}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all shadow-lg disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {isCompleting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Completing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Mark as Complete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodeScanner;