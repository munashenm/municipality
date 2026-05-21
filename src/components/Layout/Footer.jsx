export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} SmartCity Municipality. POPIA compliant. All rights reserved.</p>
        <p className="footer-sub">Serving our community with digital municipal services.</p>
      </div>
    </footer>
  );
}
