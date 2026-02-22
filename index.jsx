// Wrapper for React App

import { createRoot } from "react-dom/client";
import GBooks from "./src/GBooks"

const root = createRoot(document.getElementById("root"));

root.render(<GBooks />);