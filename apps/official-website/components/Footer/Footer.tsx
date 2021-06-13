import React, { FunctionComponent } from 'react';
import { Styles } from './Footer.styles';
import copyRight from 'copyright';
import { Row, Col } from 'shards-react';
import { BootstrapIcon, Section } from '..';
import type { IFooterProps } from './Footer.types';

export const Footer: FunctionComponent<IFooterProps> = ({ ...rest }) => {
  const { root, icons } = Styles({});

  return (
    <Section className="text-white" {...root} {...rest}>
      <Row>
        <Col>{copyRight('Morajlab')}</Col>
        <Col lg={2} className="text-center" {...icons}>
          <BootstrapIcon name="github" />
          <BootstrapIcon name="twitter" />
        </Col>
      </Row>
    </Section>
  );
};

export default Footer;