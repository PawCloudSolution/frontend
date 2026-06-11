import { useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { useInternationalControllerSubmitOrg } from '../../api/generated/internationals/internationals.js';
import styles from './InternationalApplicationForm.module.scss';

export function InternationalApplicationForm() {
  const { route } = useLocation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    organizationName: '',
    countryCode: '',
    taxNumber: '',
    registrationNumber: '',
    presidentName: '',
    presidentSurname: '',
    presidentEmail: '',
    presidentPhone: '',
    presidentPasswordPlain: ''
  });

  const submitMutation = useInternationalControllerSubmitOrg({
    mutation: {
      onSuccess: () => {
        setIsSuccess(true);
      },
      onError: (err: any) => {
        setErrorMsg(err.response?.data?.message || 'Failed to submit application. Please try again.');
      }
    }
  });

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setFormData({ ...formData, [target.name]: target.value });
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setErrorMsg('');
    submitMutation.mutate({
      data: {
        ...formData,
        documents: ['dummy_doc_url'] // Defaulting until file upload is implemented
      }
    });
  };

  if (isSuccess) {
    return (
      <div class={styles.formContainer}>
        <div class={styles.glassCard}>
          <div class={styles.successState}>
            <div class={styles.icon}>🎉</div>
            <h2>Application Submitted!</h2>
            <p>
              Your application to register <strong>{formData.organizationName}</strong> has been successfully received. 
              Please wait for approval from a SuperAdmin. Once approved, you will be able to log in with the credentials you provided.
            </p>
            <a href="/auth/login" class={styles.loginBtn}>Go to Login</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div class={styles.formContainer}>
      <div class={styles.glassCard}>
        <div class={styles.header}>
          <h1>Register International Organization</h1>
          <p>Submit your application to create a new International Organization on Paw Cloud.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {errorMsg && <div class={styles.errorMsg}>{errorMsg}</div>}

          <div class={styles.row}>
            <div class={styles.formGroup}>
              <label htmlFor="organizationName">Organization Name</label>
              <input type="text" id="organizationName" name="organizationName" required value={formData.organizationName} onInput={handleChange} placeholder="e.g. Paw Club International" />
            </div>
            <div class={styles.formGroup}>
              <label htmlFor="countryCode">Country Code</label>
              <input type="text" id="countryCode" name="countryCode" required value={formData.countryCode} onInput={handleChange} placeholder="e.g. US, UA, GB" maxLength={2} />
            </div>
          </div>

          <div class={styles.row}>
            <div class={styles.formGroup}>
              <label htmlFor="taxNumber">Tax Number</label>
              <input type="text" id="taxNumber" name="taxNumber" required value={formData.taxNumber} onInput={handleChange} placeholder="Tax Identification Number" />
            </div>
            <div class={styles.formGroup}>
              <label htmlFor="registrationNumber">Registration Number</label>
              <input type="text" id="registrationNumber" name="registrationNumber" required value={formData.registrationNumber} onInput={handleChange} placeholder="Official Reg Number" />
            </div>
          </div>

          <hr style={{ border: '1px solid rgba(255,255,255,0.1)', margin: '2rem 0' }} />

          <div class={styles.row}>
            <div class={styles.formGroup}>
              <label htmlFor="presidentName">President First Name</label>
              <input type="text" id="presidentName" name="presidentName" required value={formData.presidentName} onInput={handleChange} placeholder="Jane" />
            </div>
            <div class={styles.formGroup}>
              <label htmlFor="presidentSurname">President Last Name</label>
              <input type="text" id="presidentSurname" name="presidentSurname" required value={formData.presidentSurname} onInput={handleChange} placeholder="Smith" />
            </div>
          </div>

          <div class={styles.row}>
            <div class={styles.formGroup}>
              <label htmlFor="presidentEmail">President Email</label>
              <input type="email" id="presidentEmail" name="presidentEmail" required value={formData.presidentEmail} onInput={handleChange} placeholder="jane.smith@example.com" />
            </div>
            <div class={styles.formGroup}>
              <label htmlFor="presidentPhone">President Phone</label>
              <input type="text" id="presidentPhone" name="presidentPhone" value={formData.presidentPhone} onInput={handleChange} placeholder="+12025550123" />
            </div>
          </div>

          <div class={styles.formGroup}>
            <label htmlFor="presidentPasswordPlain">Password</label>
            <input type="password" id="presidentPasswordPlain" name="presidentPasswordPlain" required value={formData.presidentPasswordPlain} onInput={handleChange} placeholder="Secure password for login" />
          </div>

          <button type="submit" class={styles.submitBtn} disabled={submitMutation.isPending}>
            {submitMutation.isPending ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
