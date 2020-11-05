import gql from 'graphql-tag';

export const GET_OTP = gql`query getOTP($telephone:String!){
	sendOTPtoPhone(telephone: $telephone) {
		is_enable
		msg
		response
	}
}`