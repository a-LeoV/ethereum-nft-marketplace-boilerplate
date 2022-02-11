
import React, { useState } from "react";

const ApproveButton = () => {
    const [isDisabled, setDisabled] = useState(false);
    const handleSubmit = () => {
      console.log('Your button was clicked and is now disabled');
      setDisabled(true);
    }
    return (
      <button type="button" onClick={handleSubmit} disabled={isDisabled}>
        Submit
      </button>
  );
}

export default ApproveButton;