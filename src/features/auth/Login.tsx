import { useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { useAuthControllerLogin } from '../../api/generated/auth/auth.js';
import { login as authStoreLogin } from '../../store/authStore.js';
import styles from './Login.module.scss';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { route } = useLocation();

  const loginMutation = useAuthControllerLogin({
    mutation: {
      onSuccess: (response: any) => {
        // If our DTO generation failed previously, it might not be fully typed.
        // We typecast it or use response.data dynamically for safety until backend resolves.
        const payload = response.data;
        if (payload?.user) {
          authStoreLogin(payload.user);
          route('/dashboard');
        } else {
          setErrorMsg('Unexpected server response format.');
        }
      },
      onError: (err: any) => {
        setErrorMsg(err.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    }
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    
    loginMutation.mutate({ data: { email, password } });
  };

  return (
    <div class={styles.loginContainer}>
      <div class={styles.loginCard}>
        <h1>Welcome Back</h1>
        <form onSubmit={handleSubmit}>
          {errorMsg && <div class={styles.errorMsg}>{errorMsg}</div>}
          
          <div class={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input 
              id="email" 
              type="email" 
              value={email} 
              onInput={(e) => setEmail((e.target as HTMLInputElement).value)} 
              placeholder="Enter your email" 
              required
            />
          </div>

          <div class={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              type="password" 
              value={password} 
              onInput={(e) => setPassword((e.target as HTMLInputElement).value)} 
              placeholder="Enter your password" 
              required
            />
          </div>

          <button 
            type="submit" 
            class={styles.submitBtn} 
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}
