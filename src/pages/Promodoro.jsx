import React from "react";
import PromodoroComp from "../components/PromodoroComp";
import Container from "../components/Container/Container";
function Promodoro() {
  return (
    <div className="py-4">
      <Container>
        <PromodoroComp />
      </Container>
    </div>
  );
}

export default Promodoro;
