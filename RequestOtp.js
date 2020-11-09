import React, { useEffect, useRef, useCallback } from "react";
import { GET_OTP } from "../queries/sendOtp.gql";
import { useLazyQuery } from "@apollo/react-hooks";
import defaultClasses from "./login.scss";
import Button from "@magento/venia-ui/lib/components/Button/button";
import { useFieldState } from "informed";

const RequestOtp = () => {
    const phoneVals = useFieldState("phone").value;
    const [queryOtp, { data, error, loading }] = useLazyQuery(GET_OTP, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            if (data.sendOTPtoPhone.response == "true") {
                let btn = document.getElementById("requestOtpBtn");
                btn.classList.add(defaultClasses.hide);
                let otp = document.getElementById("enterOtp");
                otp.classList.remove(defaultClasses.hide);
                const phone = document.getElementById("enterPhoneValid");
                phone.classList.add(defaultClasses.hide);
            } else {
                let validphoneChcek = document.getElementById(
                    "enterPhoneValid"
                );
                validphoneChcek.classList.remove(defaultClasses.hide);
                validphoneChcek.classList.add(
                    defaultClasses.requirePhonenumber
                );
                let otp = document.getElementById("enterOtp");
                otp.classList.add(defaultClasses.hide);
            }
        },
    });
    const validate = useCallback(() => {
        if (phoneVals != null) {
            queryOtp({
                variables: { telephone: phoneVals },
            });
        } else {
            const phone = document.getElementById("enterPhoneValid");
            phone.classList.remove(defaultClasses.hide);
            phone.classList.add(defaultClasses.requirePhonenumber);
        }
    }, [phoneVals, queryOtp]);

    return (
        <Button
            className={defaultClasses.requestOtpBtn}
            disabled={loading}
            onClick={validate}
        >
            {"Request OTP"}
        </Button>
    );
};

export default RequestOtp;
