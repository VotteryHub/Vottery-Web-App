import React, { useState, useRef, useEffect } from 'react';
import { Camera, Monitor, Play, Square, Mic, MicOff } from 'lucide-react';

const VideoRecordingPanel = ({ onRecordingComplete, recordingMode, setRecordingMode }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [stream, setStream] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream?.getTracks()?.forEach(track => track?.stop());
      }
      if (timerRef?.current) {
        clearInterval(timerRef?.current);
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: recordingMode === 'camera' ? { facingMode: 'user', width: 1080, height: 1920 } : false,
        audio: audioEnabled,
      };

      if (recordingMode === 'screen') {
        const displayStream = await navigator.mediaDevices?.getDisplayMedia({
          video: { width: 1080, height: 1920 },
          audio: audioEnabled,
        });
        setStream(displayStream);
        if (videoRef?.current) {
          videoRef.current.srcObject = displayStream;
        }
      } else {
        const cameraStream = await navigator.mediaDevices?.getUserMedia(constraints);
        setStream(cameraStream);
        if (videoRef?.current) {
          videoRef.current.srcObject = cameraStream;
        }
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const startRecording = () => {
    if (!stream) return;

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event?.data?.size > 0) {
        setRecordedChunks((prev) => [...prev, event?.data]);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      onRecordingComplete(blob);
      setRecordedChunks([]);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder?.start();
    setIsRecording(true);

    // Start timer
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef?.current && isRecording) {
      mediaRecorderRef?.current?.stop();
      setIsRecording(false);
      if (timerRef?.current) {
        clearInterval(timerRef?.current);
      }
      setRecordingTime(0);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
  };

  return (
    <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Video Recording</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setRecordingMode('camera')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              recordingMode === 'camera' ?'bg-yellow-400 text-black' :'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            <Camera className="w-4 h-4 inline-block mr-2" />
            Camera
          </button>
          <button
            onClick={() => setRecordingMode('screen')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              recordingMode === 'screen' ?'bg-yellow-400 text-black' :'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            <Monitor className="w-4 h-4 inline-block mr-2" />
            Screen
          </button>
        </div>
      </div>

      {/* Video Preview */}
      <div className="relative bg-black rounded-xl overflow-hidden aspect-[9/16] mb-4">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-500 px-3 py-2 rounded-full">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            <span className="text-white font-bold">{formatTime(recordingTime)}</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        {!stream && (
          <button
            onClick={startCamera}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            <Play className="w-5 h-5 inline-block mr-2" />
            Start Preview
          </button>
        )}

        {stream && !isRecording && (
          <button
            onClick={startRecording}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            <Play className="w-5 h-5 inline-block mr-2" />
            Start Recording
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            <Square className="w-5 h-5 inline-block mr-2" />
            Stop Recording
          </button>
        )}

        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className={`p-3 rounded-xl transition-all ${
            audioEnabled
              ? 'bg-white/10 text-white hover:bg-white/20' :'bg-red-500/20 text-red-400 hover:bg-red-500/30'
          }`}
        >
          {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default VideoRecordingPanel;