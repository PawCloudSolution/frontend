import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Header } from './components/Header.jsx';
import { Home } from './pages/Home/index.jsx';
import { NotFound } from './pages/_404.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { Login } from './features/auth/Login.jsx';
import { authState, checkAuth } from './store/authStore';
import { useEffect } from 'preact/hooks';
import './api/axios'; // Initialize global axios defaults
import './style.css';

const queryClient = new QueryClient({
	defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } }
});

export function App() {
	useEffect(() => {
		checkAuth();
	}, []);

	if (!authState.isInitialized.value) {
		return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#fff' }}>Loading...</div>;
	}

	return (
		<QueryClientProvider client={queryClient}>
			<LocationProvider>
				<Header />
				<main>
					<Router>
						<Route path="/" component={Home} />
						<Route path="/auth/login" component={Login} />
						<ProtectedRoute path="/dashboard" component={() => <div>Dashboard placeholder</div>} />
						<ProtectedRoute path="/organizations" component={() => <div>Organizations placeholder</div>} allowedRoles={['SuperAdmin', 'InternationalPresident', 'HQPresident']} />
						<Route default component={NotFound} />
					</Router>
				</main>
			</LocationProvider>
		</QueryClientProvider>
	);
}

render(<App />, document.getElementById('app'));
