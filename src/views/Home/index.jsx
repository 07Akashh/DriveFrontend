import { useTheme } from "../../context/ThemeContext";
import { useLogin } from "../../hooks/useAuth";

const HomePage = () => {
  const { loginWithGoogle, isLoading } = useLogin();
  const { theme, toggleTheme } = useTheme();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-theme-primary">
      <header className="border-b border-theme">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-theme-secondary rounded-lg flex items-center justify-center border border-theme">
              <svg
                className="w-5 h-5 text-theme-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
              </svg>
            </div>
            <span className="text-theme-primary font-semibold text-lg">
              Drive
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="text-theme-secondary hover:text-theme-primary p-2"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-theme-primary mb-4 leading-tight">
            Store, Share, Access
            <br className="hidden sm:block" />
            <span className="text-theme-secondary">Your Files Anywhere</span>
          </h2>
          <p className="text-theme-secondary text-base sm:text-lg max-w-xl mx-auto mb-8">
            Secure cloud storage with simple sharing. Upload and manage your
            files with ease.
          </p>
          <button onClick={handleGoogleLogin} className="btn-primary px-6 py-3">
            Get Started Free
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12",
              title: "Easy Upload",
              desc: "Drag and drop or click to upload any file type",
            },
            {
              icon: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316",
              title: "Share Securely",
              desc: "Share with specific users or generate links",
            },
            {
              icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
              title: "Encrypted Storage",
              desc: "Your files are encrypted and stored securely",
            },
          ].map((f, i) => (
            <div key={i} className="card p-6 text-center">
              <div className="w-12 h-12 bg-theme-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-theme-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d={f.icon}
                  />
                </svg>
              </div>
              <h3 className="text-theme-primary font-medium mb-1">{f.title}</h3>
              <p className="text-theme-muted text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
