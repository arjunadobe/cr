import BrowserPersistence from '@magento/peregrine/lib/util/simplePersistence';

const storage = new BrowserPersistence();

export const loginEventpage = props => {
    const rememberInfo = storage.getItem('remember_info') || {};
    const {email, password} = rememberInfo;
    const isRemembered = () => !!email
    const loginEmail = () => email;
    const loginPassword = () => password;
    return {
        isRemembered,
        loginEmail,
        loginPassword
    };
};

export const setRememberInfo = rememberInfo =>
    async function thunk(...args) {
        const [dispatch] = args;
        storage.setItem('remember_info', dispatch);
    };

export const clearRememberInfo = rememberInfo =>
    async function thunk(...args) {
        const [dispatch] = args;
        storage.removeItem('remember_info');
    };
