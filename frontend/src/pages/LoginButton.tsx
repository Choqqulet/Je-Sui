import { createEphemeral, buildGoogleAuthUrl } from "../zkLogin";

export default function LoginButton() {
  const onLogin = async () => {
    // create ephemeral key & randomness and store in sessionStorage
    const { nonce } = await createEphemeral();

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
    const redirectUri =
      (import.meta.env.VITE_REDIRECT_URI as string) ||
      `${window.location.origin}/auth/callback`;
    if (!clientId || !redirectUri)
      return alert("set VITE_GOOGLE_CLIENT_ID and VITE_REDIRECT_URI in .env");

    // Build Google OAuth implicit URL with nonce: extendedEphemeralPublicKey|jwtRandomness|maxEpoch
    const authUrl = buildGoogleAuthUrl(clientId, redirectUri, nonce);

    window.location.href = authUrl;
  };

  return (
    <div>
      <button
        className="google-btn"
        onClick={onLogin}
        aria-label="Sign in with Google"
      >
        <svg
          className="google-icon"
          viewBox="0 0 533.5 544"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            fill="#EA4335"
            d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.3H272v95.3h147.1c-6.4 34.6-25.9 63.9-55.4 83.5v69.4h89.7c52.5-48.3 80.1-119.5 80.1-197.9z"
          />
          <path
            fill="#34A853"
            d="M272 544c72.6 0 133.6-24 178.1-65.1l-89.7-69.4c-24.9 16.7-57 26.5-88.4 26.5-67.9 0-125.4-45.8-146-107.3H35.1v67.5C79.2 486.2 170.6 544 272 544z"
          />
          <path
            fill="#4A90E2"
            d="M126 328.7c-9.1-26.8-9.1-56 0-82.8V178.4H35.1c-37.7 75.4-37.7 165.8 0 241.2l90.9-67.9z"
          />
          <path
            fill="#FBBC05"
            d="M272 107.7c39.5 0 75.1 13.6 103.1 40.3l77.3-77.3C405.6 24 344.6 0 272 0 170.6 0 79.2 57.8 35.1 178.4l90.9 67.5C146.6 153.5 204.1 107.7 272 107.7z"
          />
        </svg>
        <span>Sign in with Google</span>
      </button>
    </div>
  );
}
