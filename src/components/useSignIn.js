import React, { useCallback, useRef, useState } from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';


import { retrieveCartId } from '@magento/peregrine/lib/store/actions/cart';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';
import { clearCustomerDataFromCache } from '@magento/peregrine/lib/Apollo/clearCustomerDataFromCache';
import { useHistory, Redirect } from 'react-router-dom';
import { useToasts } from '@magento/peregrine';
import {
    AlertCircle as AlertCircleIcon,
} from 'react-feather';
import Icon from '@magento/venia-ui/lib/components/Icon/icon';
import ToastContainer from '@magento/venia-ui/lib/components/ToastContainer/toastContainer';
import Login from './login';
import { setRememberInfo, clearRememberInfo } from '../../talons/loginEventpage';

const ErrorIcon = <Icon src={AlertCircleIcon} attrs={{ width: 18 }} />;

export const useSignIn = props => {
    const {
        createCartMutation,
        customerQuery,
        getCartDetailsQuery,
        mergeCartsMutation,
        setDefaultUsername,
        showCreateAccount,
        showForgotPassword,
        signInMutation
    } = props;

    const apolloClient = useApolloClient();
    const [isSigningIn, setIsSigningIn] = useState(false);

    const [
        { cartId },
        { createCart, removeCart, getCartDetails }
    ] = useCartContext();

    const [
        { isGettingDetails, getDetailsError },
        { getUserDetails, setToken }
    ] = useUserContext();

    const [signIn, { error: signInError }] = useMutation(signInMutation, {
        fetchPolicy: 'no-cache'
    });
    const [fetchCartId] = useMutation(createCartMutation);
    const [mergeCarts] = useMutation(mergeCartsMutation);
    const fetchUserDetails = useAwaitQuery(customerQuery);
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    const talonPropsRememberInfo = setRememberInfo();
    const talonClearRememberInfo = clearRememberInfo();


    const errors = [];
    if (signInError) {
        errors.push(signInError.graphQLErrors[0]);
    }
    if (getDetailsError) {
        errors.push(getDetailsError);
    }

    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);
    const [, { addToast }] = useToasts();
    const [getToken, storeToken] = useState(null);

    const handleSubmit = useCallback(
        async ({ email, password, subscribe }) => {
            if(subscribe) {
                await talonPropsRememberInfo({ email, password});
            } else {
                await talonClearRememberInfo({ email, password});
            }
            setIsSigningIn(true);
            try {
                // Get source cart id (guest cart id).
                const sourceCartId = cartId;

                // Sign in and set the token.
                const signInResponse = await signIn({
                    variables: { email, password }
                });
                const token = signInResponse.data.generateCustomerToken.token;
                localStorage.setItem('Token', token)
                storeToken(token)
                if(token != null && subscribe) {
                    await talonPropssetRememberInfo({ email, password});
                }
                await setToken(token);
                // Clear all cart/customer data from cache and redux.
                await clearCartDataFromCache(apolloClient);
                await clearCustomerDataFromCache(apolloClient);
                await removeCart();

                // Create and get the customer's cart id.
                await createCart({
                    fetchCartId
                });
                const destinationCartId = await retrieveCartId();

                // Merge the guest cart into the customer cart.
                // await mergeCarts({
                //     variables: {
                //         destinationCartId,
                //         sourceCartId
                //     }
                // });

                // Ensure old stores are updated with any new data.
                getUserDetails({ fetchUserDetails });
                getCartDetails({ fetchCartId, fetchCartDetails });
            } catch (error) {
                addToast({
                    type: 'error',
                    icon: ErrorIcon,
                    message: error.toString(),
                    timeout: 3000
                });
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }

                setIsSigningIn(false);
            }
        },
        [
            cartId,
            apolloClient,
            removeCart,
            signIn,
            setToken,
            createCart,
            fetchCartId,
            mergeCarts,
            getUserDetails,
            fetchUserDetails,
            getCartDetails,
            fetchCartDetails
        ]
    );

    const handleForgotPassword = useCallback(() => {
        const { current: formApi } = formApiRef;

        if (formApi) {
            setDefaultUsername(formApi.getValue('email'));
        }

        showForgotPassword();
    }, [setDefaultUsername, showForgotPassword]);

    const handleCreateAccount = useCallback(() => {
        const { current: formApi } = formApiRef;

        if (formApi) {
            setDefaultUsername(formApi.getValue('email'));
        }

        showCreateAccount();
    }, [setDefaultUsername, showCreateAccount]);

    
    
    return {
        errors,
        handleCreateAccount,
        handleForgotPassword,
        handleSubmit,
        isBusy: isGettingDetails || isSigningIn,
        setFormApi,
        getToken
    };
};
