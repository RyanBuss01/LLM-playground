import {assignOverlay} from "../classes/messageHandler";

function Overlay({ isActive, onInputChange, instruction }) {
    if (!isActive) return null;
    return  assignOverlay(instruction, onInputChange);
  }
  
  export default Overlay;