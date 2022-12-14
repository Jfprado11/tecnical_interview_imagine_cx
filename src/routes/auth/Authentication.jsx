import { faKey, faLock, faLockOpen, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Button from '../../components/general/Button';
import Input from '../../components/general/Input';
import Snackbar from '../../components//general/Snackbar';
import { login } from '../../services/auth';

import './auth.css';

const usernameAttr = { autoComplete: 'username', labelFor: 'username' };
const passwordAttr = { autoComplete: 'current-password', labelFor: 'password' };

function Authentication({ user, setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const snackbarRefNotAuth = useRef(null);
  const snackbarRefError = useRef(null);

  if (user.isLoggedIn) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (onSubmit) => {
    onSubmit.preventDefault();
    const isValid = await login(username, password);
    if (isValid.logged) {
      setUser({ username, isLoggedIn: true });
    }
    if (!isValid.logged) {
      if (isValid.status === 401) {
        snackbarRefNotAuth.current.show();
      } else {
        snackbarRefError.current.show();
      }
    }
  };

  const handleDisabled = () => {
    if (username && password) return false;
    return true;
  };

  return (
    <>
      <form className="form" onSubmit={handleSubmit}>
        <div className="auth-header">
          <h2>Iniciar Sesion</h2>
        </div>
        <div className="auth-container">
          <Input
            inputAttributes={usernameAttr}
            icon={faUser}
            label={'Usuario'}
            className={'input--dark'}
            value={username}
            setValue={setUsername}
          />
          <Input
            inputAttributes={passwordAttr}
            icon={faKey}
            label={'Contraseña'}
            className={'input--dark'}
            type={'password'}
            value={password}
            setValue={setPassword}
          />
          <Button
            type={'submit'}
            icon={handleDisabled() ? faLock : faLockOpen}
            className={'btn--light'}
            isDisabled={handleDisabled()}
          >
            Ingresar
          </Button>
        </div>
      </form>
      <Snackbar ref={snackbarRefNotAuth} message="Las credenciales no estan correctas" type="error" />
      <Snackbar ref={snackbarRefError} message="Surgio algun error" type="error" icon={faXmark} />
    </>
  );
}

export default Authentication;
