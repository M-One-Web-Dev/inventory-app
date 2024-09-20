import React, { useState, useEffect } from "react";

export default function InstallPopup({ onClose }) {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            console.log("beforeinstallprompt event fired"); // Debugging log
            setIsVisible(true);
        };

        window.addEventListener(
            "beforeinstallprompt",
            handleBeforeInstallPrompt
        );

        return () => {
            window.removeEventListener(
                "beforeinstallprompt",
                handleBeforeInstallPrompt
            );
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            console.log("Prompting install..."); // Debugging log
            deferredPrompt.prompt(); // Show the install prompt
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`); // Debugging log
            if (outcome === "accepted") {
                console.log("User accepted the install prompt");
            } else {
                console.log("User dismissed the install prompt");
            }
            setDeferredPrompt(null); // Reset the deferredPrompt
            handleClose(); // Close the popup after handling the install prompt
        } else {
            console.log("deferredPrompt is null, cannot prompt install."); // Debugging log
        }
    };

    const handleRemindLaterClick = () => {
        handleClose(); // Close the popup when reminding later
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose(); // Trigger the parent onClose after animation ends
        }, 300); // Duration should match the transition duration
    };

    return (
        <>
            {/* Manual Trigger Button */}
            {/* <div
                className={`fixed flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 h-screen w-full`}
            >
                <div
                    className={`bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto transition-all duration-300 `}
                >
                    <h2 className="text-xl font-semibold mb-4">
                        Install Website ini?
                    </h2>
                    <p className="mb-6">
                        Install Website ini agar bisa mendapatkan pengalaman
                        yang Lebih Baik.
                    </p>
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={handleRemindLaterClick}
                            className="bg-gray-300 text-black px-4 py-2 rounded-md"
                        >
                            Nanti Aja
                        </button>
                        <button
                            onClick={handleInstallClick}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md"
                        >
                            Install
                        </button>
                    </div>
                </div>
            </div> */}
        </>
    );
}
