import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { Link, useLocation } from "react-router-dom";

export const NavigationBar = ({ user, onLoggedOut }) => {
  const { pathname } = useLocation();

  return (
    <Navbar expand="lg" variant="dark" className="sw-nav">
      <Container className="sw-nav__inner">
        <Navbar.Brand as={Link} to="/" className="sw-nav__brand">
          myFlix
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="sw-navbar" className="sw-nav__toggle" />
        <Navbar.Collapse id="sw-navbar">
          {/* left */}
          <Nav className="me-auto sw-nav__links">
            {user ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/"
                  className={pathname === "/" ? "is-active" : ""}
                >
                  Home
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/search"
                  className={pathname === "/search" ? "is-active" : ""}
                >
                  Search
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                  className={pathname === "/login" ? "is-active" : ""}
                >
                  Login
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/signup"
                  className={pathname === "/signup" ? "is-active" : ""}
                >
                  Signup
                </Nav.Link>
              </>
            )}
          </Nav>

          {/* right */}
          <Nav className="ms-auto sw-nav__actions">
            {user ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/profile"
                  className={pathname === "/profile" ? "is-active" : ""}
                >
                  Profile
                </Nav.Link>

                <Button
                  variant="outline-light"
                  size="sm"
                  className="sw-nav__btn"
                  onClick={onLoggedOut}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/signup" className="sw-nav__cta">
                Create account
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
