import React from 'react';
import { animateScroll } from 'react-scroll';
import { Link } from '@reach/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ScrollTop = () => {
  const [show, setShow] = React.useState(false);
  const handleScroll = () => {
    const scrollOffset = 600;

    if (window.scrollY > scrollOffset) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  React.useLayoutEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  const scrollToTop = (e) => {
    e.preventDefault();
    animateScroll.scrollToTop();
  };

  let classes = 'rounded scroll-to-top';
  classes += show ? ' show' : '';

  return (
    <Link className={classes} to="#page-top" onClick={scrollToTop}>
      <FontAwesomeIcon icon="angle-up" />
    </Link>
  );
};

export default ScrollTop;
