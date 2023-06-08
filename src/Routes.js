import React, { Component } from 'react';
import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// import { setCurrentUser } from './redux/user/user.actions';
import { selectCurrentUser } from './redux/user/userSelector';

function Routes({ currentUser }) {
    console.log(`Check No Internet: ${currentUser}`);
  return currentUser ? <PrivateRoutes /> : <PublicRoutes />;
}

// const mapStateToProps = (state) => ({
//   isAuthenticated: state.auth.isAuthenticated,
// });

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

export default connect(mapStateToProps, {})(Routes);