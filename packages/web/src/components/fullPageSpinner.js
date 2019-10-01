import React from "react";
import { Spinner } from "reactstrap";

const FullPageSpinner = () => {
  return (
    <div className="text-center" style={{ marginTop: "3em", fontSize: "4em" }}>
      <Spinner color="secondary" />
    </div>
  );
};

export default FullPageSpinner;
