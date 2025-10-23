/* React Icons */
import { IconContext } from "react-icons";
import { SlQuestion } from "react-icons/sl";

/* libraries */
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

/* React Bootstrap */
import Tooltip from "react-bootstrap/Tooltip";

function TooltipComponent({ text, config = {} }) {
  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip id={"overlay"}>{text}</Tooltip>}
    >
      <span className="ms-1">
        <IconContext.Provider value={config}>
          <SlQuestion />
        </IconContext.Provider>
      </span>
    </OverlayTrigger>
  );
}

export default TooltipComponent;
