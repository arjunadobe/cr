export const getRememberInfo = props => {
    const Email = localStorage.getItem('Email');
    const Password = localStorage.getItem('Password');
    const isRemembered = () => !!Email
    const loginEmail = () => Email;
    const loginPassword = () => Password;
    return {
        isRemembered,
        loginEmail,
        loginPassword
    };
};
