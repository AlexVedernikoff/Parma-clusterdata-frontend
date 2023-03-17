import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import ButtonIcon from '../ButtonIcon/ButtonIcon';
import { Icon } from '@parma-data-ui/common/src';
import closeBig from '@parma-data-ui/clusterdata/src/icons/close-big.svg';
import { Button } from 'lego-on-react';
import LayoutShadow from '../LayoutShadow/LayoutShadow';

const b = block('side-sliding-panel');

function SideSlidingPanel({
  title = '',
  footerContent,
  isOpen = false,
  onCloseAction = () => {},
  styleMods,
  children,
}) {
  const getFooter = () => {
    return footerContent && <div className={b('footer')}>{footerContent}</div>;
  };

  return (
    <React.Fragment>
      <div className={b({ view: isOpen ? 'open' : 'close', ...styleMods })}>
        <div className={b('header')}>
          {title}
          <Button theme="flat" view="default" tone="default" size="n" cls={b('close')} onClick={onCloseAction}>
            <ButtonIcon>
              <Icon data={closeBig} width="22" height="22" />
            </ButtonIcon>
          </Button>
        </div>

        <div className={b('body')}>{children}</div>

        {getFooter()}
      </div>

      <LayoutShadow onShadowClick={onCloseAction} isShown={isOpen} />
    </React.Fragment>
  );
}

SideSlidingPanel.propTypes = {
  title: PropTypes.string,
  footerContent: PropTypes.element,
  isOpen: PropTypes.bool,
  onCloseAction: PropTypes.func,
  styleMods: PropTypes.object,
};

export default SideSlidingPanel;
