import React, { useState, Component, useEffect, useRef, useCallback   } from 'react';
import { Link, Redirect } from "react-router-dom";
import Field from '@magento/venia-ui/lib/components/Field/field';
import Button from '@magento/venia-ui/lib/components/Button/button';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox/checkbox';
import TextInput from '@magento/venia-ui/lib/components/TextInput/textInput';
import Icon from '@magento/venia-ui/lib/components/Icon/icon';
import { Container, Row, Col } from 'react-bootstrap';
import {
  EyeOff, Eye, AlertCircle
} from 'react-feather';

import { func, shape, string } from 'prop-types';
import { Form } from 'informed';
import { useSignIn } from './useSignIn';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import CREATE_CART_MUTATION from '@magento/venia-ui/lib/queries/createCart.graphql';
import GET_CUSTOMER_QUERY from '@magento/venia-ui/lib/queries/getCustomer.graphql';
import SIGN_IN_MUTATION from '@magento/venia-ui/lib/queries/signIn.graphql';
import { mergeCartsMutation } from '@magento/venia-ui/lib/queries/mergeCarts.gql';

import defaultClasses from './login.scss';
import { GET_CART_DETAILS_QUERY } from '@magento/venia-ui/lib/components/SignIn/signIn.gql';
import ToastContainer from '@magento/venia-ui/lib/components/ToastContainer/toastContainer';
import { getRememberInfo } from './utils/loginEventpage';

import { Info } from 'react-feather';

// Components import
import { MarketPlace } from '../MarketPlace/marketPlace';
import OtpInput from 'react-otp-input';
import RequestOtp  from './RequestOtp';
import LoginOtp  from './loginOtp';
import ResendOtp from './ResendOtp';
import Tooltip from 'react-bootstrap/Tooltip';

const Login = props => {
  
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const [otp, setOtp] = useState(null);
  const handleOtp = (event) => {
    setOtp(event)
  }
  
  
  const formApiOtp = useRef(null);
  
  // pass this to `Form` to get its API
  const setFormOtpApi = useCallback(
        api => { formApiOtp.current = api },
        []
  );


  const { setDefaultUsername, showCreateAccount, showForgotPassword } = props;

  const talonProps = useSignIn({
    createCartMutation: CREATE_CART_MUTATION,
    customerQuery: GET_CUSTOMER_QUERY,
    getCartDetailsQuery: GET_CART_DETAILS_QUERY,
    signInMutation: SIGN_IN_MUTATION,
    mergeCartsMutation,
    setDefaultUsername,
    showCreateAccount,
    showForgotPassword
  });

 

  const UtilsGetRememberInfo = getRememberInfo();
  const {
    isRemembered,
    loginEmail,
    loginPassword
  } = UtilsGetRememberInfo;


  const {
    errors,
    handleCreateAccount,
    handleForgotPassword,
    handleSubmit,
    isBusy,
    setFormApi,
    getToken
  } = talonProps;

  

  
  return (
    <Container fluid="md" className={defaultClasses['custom-container']}>
      <Row>
        <Col xs={12} md={6} lg={5} xl={4} className={defaultClasses['col-center']}>
          {getToken ? <Redirect to="/homePage" />  :
        <div className={defaultClasses.main}>
            <ToastContainer />
            <MarketPlace />
            <div className={defaultClasses.root}>
              <div className={defaultClasses.login}>

                <div className={defaultClasses.tabframe}>

                <ul  className={defaultClasses.nav + '' + defaultClasses[']nav-tabs']} className={defaultClasses['toggling-tabs']}>
                  <li className="active"><a data-toggle="tab" href="#emailLogin">Email ID</a></li>
                  <li><a data-toggle="tab" href="#mobileLogin">Mobile Number</a></li>
                </ul>

                <div className="tab-content">
                  <div id="emailLogin" className="tab-pane in active">
                    <div className={defaultClasses.tab}>
                      <Form
                        getApi={setFormApi}

                        onSubmit={handleSubmit}>
                        <h1>Login</h1>

                        <Field label="Email ID" className={defaultClasses.emailField} required={true}>
                          <TextInput
                            field="email"
                            id="email"
                            initialValue={loginEmail}
                            autoComplete="email"
                            placeholder="Enter here"
                            validate={isRequired} />
                        </Field>

                        <div className={defaultClasses.passwordwithIcon}>
                          <Field label="Password" className={defaultClasses.passwordField} required={true}>
                            <Link to="/showforgotPassword" tabindex="-1" className={defaultClasses.forgotpassword}>Forgot Password?</Link>
                            <TextInput
                              field="password"
                              id="password"
                              initialValue={loginPassword}
                              type={passwordShown ? "text" : "password"}
                              autoComplete="new-password"
                              placeholder="Password"
                              validate={isRequired}
                            />
                            <Icon onClick={togglePasswordVisiblity} src={passwordShown ? EyeOff : Eye} attrs={{ width: 25 }} />
                          </Field>
                        </div>

                        <div className={defaultClasses.rememberMe}>
                          <Checkbox
                            field="subscribe"
                            label="Remember Me"
                            id="checkbox"
                            initialValue={isRemembered}
                            className={defaultClasses.rememberMeCheckbox} />
                            <Icon className={defaultClasses['info-icon']} src={Info} className={defaultClasses.tooltip} size={14} />
                            
                        </div>
                        <br />
                        <div className={defaultClasses.terms}>By continuing, you agree to Marketplace's <a href="#">Terms and Conditions</a> and <a href="#">Privacy Policies</a></div>
                        <div className={defaultClasses.loginBtn}>
                          <Button type="submit" priority="high" className={defaultClasses.login}>
                            {'Login'}
                          </Button>
                        </div>
                        <div className={defaultClasses.newUser}>
                          New User? <a href="#">REGISTER NOW</a>
                          {/* <Link to="/register">REGISTER NOW</Link> */}
                        </div>
                      </Form>

                      </div>
                  </div>
                  
                  <div id="mobileLogin" className="tab-pane">
                    <div className={defaultClasses.tab}>
                      <Form getApi={setFormOtpApi}>
                        <h1>Login</h1>
                        <Field label="Mobile Number" className={defaultClasses.emailField} required={true}>
                          <TextInput
                            field="phone"
                            autoComplete="phone"
                            placeholder="Enter here"
                            validate={isRequired}
                           />
                        </Field>
                        <p id="enterPhone" className={defaultClasses.hide}>Please enter phone number</p>
                        <p id="enterPhoneValid" className={defaultClasses.hide}>Please enter valid phone number</p>
                        <div id="requestOtpBtn" className={defaultClasses.requestOtp}>
                            <RequestOtp/>
                        </div> 
                        <div id="enterOtp" className={defaultClasses.hide}>
                        
                          <div className={defaultClasses.otpcomponent}>
                            <label>OTP</label>
                            <div className={defaultClasses.resendOtp}>
                              (1:30 minutes) <ResendOtp />
                            </div>
                          </div>
                          <div className={defaultClasses.enterOtpComponent}>
                            
                              <OtpInput
                                  value={otp}
                                  numInputs={6} 
                                  onChange={(event) => {handleOtp(event)}} />
                            
                          </div>
                        </div>
                        
                        <div className={defaultClasses.terms}>By continuing, you agree to Marketplace's <a href="#">Terms and Conditions</a> and <a href="#">Privacy Policies</a></div>
                        <div className={defaultClasses.otpLoginBtn}>
                          <LoginOtp otp={otp} />
                        </div>
                        <div className={defaultClasses.newUser}>
                          New User? <a href="#">REGISTER NOW</a>
                          {/* <Link to="/register">REGISTER NOW</Link> */}
                        </div>
                      </Form>

                      </div>
                  </div>
                  
                </div>

                  {/* <div className={defaultClasses['toggle-login']}>
                    <input type="radio" defaultChecked name="tab" id="tab1" className={defaultClasses.input} />
                    <label htmlFor="tab1" className={defaultClasses.emaillabel}>Email ID</label>

                    <input type="radio" name="tab" id="tab2" className={defaultClasses.input} />
                    <label htmlFor="tab2" className={defaultClasses.passwordlabel}>Mobile Number</label>
                  </div> */}

                  
                  {/* <div className={defaultClasses.tab}>sample content 2</div> */}
                </div>
              </div>

            </div>
          </div>
        }
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
