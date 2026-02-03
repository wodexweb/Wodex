import React from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import MenuBuilder from "./MenuBuilder";

const FooterMenu = () => {
  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody>
                <h4 className="mb-1">Footer Menu</h4>
                <p className="text-muted mb-4">
                  Manage navigation items for website footer
                </p>

                <MenuBuilder location="footer" />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FooterMenu;
