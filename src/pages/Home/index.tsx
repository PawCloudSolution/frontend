import './style.css';

export function Home() {
	return (
		<div class="home">
			<h1>Welcome to Paw Cloud Solution</h1>
			<p style={{ textAlign: 'center', marginBottom: '2rem', color: 'rgba(255,255,255,0.7)' }}>
				The ultimate platform for managing dog breeding organizations globally.
			</p>
			<section>
				<Resource
					title="Create International Organization"
					description="Start here by registering a top-level international canine organization."
					href="/apply/international"
				/>
				<Resource
					title="Member Login"
					description="Already have an account? Log in to your dashboard."
					href="/auth/login"
				/>
			</section>
		</div>
	);
}

function Resource(props: { title: string; description: string; href: string }) {
	return (
		<a href={props.href} class="resource">
			<h2>{props.title}</h2>
			<p>{props.description}</p>
		</a>
	);
}
