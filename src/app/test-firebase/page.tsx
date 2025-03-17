"use client";

import { useEffect, useState } from "react";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";

export default function TestFirebase() {
  const [status, setStatus] = useState("Checking Firebase connection...");
  const [error, setError] = useState("");
  const [firebaseConfig, setFirebaseConfig] = useState(null);

  useEffect(() => {
    // Display the Firebase config (without sensitive info)
    if (auth) {
      const app = auth.app;
      setFirebaseConfig({
        name: app.name,
        options: {
          projectId: app.options.projectId,
          authDomain: app.options.authDomain,
          appId: app.options.appId ? "Configured" : "Missing",
        }
      });
    }

    if (!auth) {
      setError("Auth is not initialized - this could be because you're on the server side or Firebase failed to initialize");
      return;
    }

    try {
      setStatus("Firebase initialized. Testing anonymous auth...");
      
      signInAnonymously(auth)
        .then(() => {
          setStatus("Anonymous auth successful! Firebase is working correctly.");
        })
        .catch((error) => {
          console.error("Auth error:", error);
          setError(`Authentication error: ${error.code} - ${error.message}`);
        });
      
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("User is signed in:", user.uid);
        } else {
          console.log("User is signed out");
        }
      });
      
      return () => unsubscribe();
    } catch (err) {
      console.error("Firebase error:", err);
      setError(`Firebase initialization error: ${err.message}`);
    }
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Firebase Connection Test</h1>
      
      <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: status.includes("successful") ? "#e8f5e9" : "#f5f5f5", borderRadius: "4px" }}>
        <h2>Status</h2>
        <p>{status}</p>
      </div>
      
      {error && (
        <div style={{ color: "white", marginTop: "20px", padding: "15px", backgroundColor: "#f44336", borderRadius: "4px" }}>
          <h2>Error</h2>
          <p>{error}</p>
          
          <div style={{ marginTop: "15px" }}>
            <h3>Troubleshooting Steps</h3>
            <ul>
              <li>Verify that your Firebase project exists and is active</li>
              <li>Check that Anonymous Authentication is enabled in Firebase Console</li>
              <li>Ensure appId in your config matches the one in Firebase Console</li>
              <li>Verify your Firebase Rules allow the operations</li>
            </ul>
          </div>
        </div>
      )}
      
      {firebaseConfig && (
        <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#e3f2fd", borderRadius: "4px" }}>
          <h2>Firebase Config</h2>
          <pre style={{ background: "#f5f5f5", padding: "10px", borderRadius: "4px", overflow: "auto" }}>
            {JSON.stringify(firebaseConfig, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}