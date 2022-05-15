import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Link className="navbar-brand menuBrand" to={"/"}>
            Quote Maker
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link className="navbar-brand menuLink" to={"/category"}>
                Category
              </Link>
              <Link className="navbar-brand menuLink" to={"/subcategory"}>
                SubCategory
              </Link>
              <Link className="navbar-brand menuLink" to={"/quote"}>
                Quote
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Home;
