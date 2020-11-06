import React from 'react';
import { GET_OTP } from '../queries/sendOtp.gql';
import { useLazyQuery } from '@apollo/react-hooks';
import defaultClasses from './login.scss';
import Button from '@magento/venia-ui/lib/components/Button/button';

const RequestOtp = (props) => {
	// Fetch the data using apollo react hooks
	const [sendOtp,  { called, loading, data }] = useLazyQuery(GET_OTP, {
			variables: {telephone: props.telephone}
		});
	if (called && loading) return <p>Loading ...</p>
	if (!called) {
		return (<Button className={defaultClasses.requestOtpBtn} onClick={() => sendOtp()}>{'Request OTP'}</Button>);
	}
	if(data){
		console.log(data);
		let btn = document.getElementById("requestOtpBtn");
		btn.classList.add(defaultClasses.hide);
		let otp = document.getElementById("enterOtp");
		otp.classList.remove(defaultClasses.hide);
		return '';
	}
}

export default RequestOtp;
