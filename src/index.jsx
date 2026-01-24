import { createRoot } from "react-dom/client";
import { MainView } from "./components/main-view/main-view";

// React Bootstrap
import Container from "react-bootstrap/Container";

// Global styles (includes Bootstrap SCSS)
import "./index.scss";

const App = () => {
  return (
    <Container>
      <MainView />
    </Container>
  );
};

const container = document.querySelector("#root");
const root = createRoot(container);
root.render(<App />);
