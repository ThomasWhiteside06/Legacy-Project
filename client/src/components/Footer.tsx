import "../styles/footer.css";
const Footer = (): JSX.Element => {
  return (
    <footer className="footer">
      <div className="footer-features">
        <ul>
          <li>
            <h5>Resources</h5>
          </li>

          <li>
            <a href="https://www.google.com">FAQ</a>
          </li>
          <li>
            <a href="https://www.google.com">Newsletter</a>
          </li>
        </ul>

        <ul>
          <li>
            <h5>All about pets</h5>
          </li>
          <li>
            <a href="https://www.google.com">Nutrition</a>
          </li>

          <li>
            <a href="https://www.google.com">Training</a>
          </li>
        </ul>
        <img src="../images/logo.png" alt="logo" className="footerImg"></img>
      </div>
      <p>&copy; {new Date().getFullYear()} PetAdopt. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
