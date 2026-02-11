import React from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import MenuBuilder from "./MenuBuilder";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HeaderMenu = () => {
  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody>
                <h4 className="mb-1">Header Menu</h4>
                <p className="text-muted mb-4">
                  Manage navigation items for website header
                </p>

                <MenuBuilder location="header" />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer />

    </div>
  );
};

export default HeaderMenu;
