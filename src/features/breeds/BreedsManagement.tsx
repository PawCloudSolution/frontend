import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useBreedControllerGetBreeds, useBreedControllerCreateBreed, useBreedControllerSubmitApplication } from '../../api/generated/breeds/breeds';
import { authState } from '../../store/authStore';
import { DashboardLayout } from '../../components/DashboardLayout';

export function BreedsManagement() {
	const { data: breedsResponse, isLoading, error, refetch } = useBreedControllerGetBreeds();
	const createBreedMutation = useBreedControllerCreateBreed();
	const submitAppMutation = useBreedControllerSubmitApplication();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [breedNameEn, setBreedNameEn] = useState('');
	const [breedNameUk, setBreedNameUk] = useState('');
	const [submitError, setSubmitError] = useState('');

	const userRole = authState.user.value?.role;
	const canCreateDirectly = userRole === 'superAdmin' || userRole === 'internationalPresident';

	const handleCreate = async (e: Event) => {
		e.preventDefault();
		setSubmitError('');

		if (!breedNameEn.trim()) {
			setSubmitError('English name is required');
			return;
		}

		const names: Record<string, string> = { en: breedNameEn.trim() };
		if (breedNameUk.trim()) {
			names.uk = breedNameUk.trim();
		}

		try {
			if (canCreateDirectly) {
				await createBreedMutation.mutateAsync({ data: { names } });
			} else {
				await submitAppMutation.mutateAsync({ data: { names } });
			}
			setIsModalOpen(false);
			setBreedNameEn('');
			setBreedNameUk('');
			refetch();
		} catch (err: any) {
			setSubmitError(err?.response?.data?.message || 'Error occurred');
		}
	};

	return (
		<DashboardLayout title="Breeds Management">
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
				<h1 style={{ color: 'white', margin: 0 }}>Breeds Management</h1>
				<button 
					onClick={() => setIsModalOpen(true)}
					style={{
						background: '#4CAF50',
						color: 'white',
						border: 'none',
						padding: '10px 20px',
						borderRadius: '8px',
						cursor: 'pointer',
						fontWeight: 'bold',
						transition: 'background 0.3s'
					}}
				>
					{canCreateDirectly ? 'Add New Breed' : 'Suggest New Breed'}
				</button>
			</div>

			{isLoading && <p style={{ color: 'white' }}>Loading breeds...</p>}
			{error && <p style={{ color: '#ff5555' }}>Error loading breeds</p>}

			{!isLoading && (breedsResponse as any)?.data && (
				<div style={{
					background: 'rgba(255, 255, 255, 0.05)',
					borderRadius: '12px',
					padding: '20px',
					backdropFilter: 'blur(10px)'
				}}>
					<table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
						<thead>
							<tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
								<th style={{ padding: '12px' }}>English Name</th>
								<th style={{ padding: '12px' }}>Ukrainian Name</th>
							</tr>
						</thead>
						<tbody>
							{((breedsResponse as any).data as any[]).map((breed: any) => (
								<tr key={breed.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
									<td style={{ padding: '12px' }}>{breed.names?.en}</td>
									<td style={{ padding: '12px' }}>{breed.names?.uk || '-'}</td>
								</tr>
							))}
							{((breedsResponse as any).data as any[]).length === 0 && (
								<tr>
									<td colSpan={2} style={{ padding: '12px', textAlign: 'center', color: '#aaa' }}>
										No breeds found
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			)}

			{isModalOpen && (
				<div style={{
					position: 'fixed',
					top: 0, left: 0, right: 0, bottom: 0,
					background: 'rgba(0,0,0,0.7)',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					zIndex: 1000
				}}>
					<div style={{
						background: '#1a1a1a',
						padding: '30px',
						borderRadius: '16px',
						width: '400px',
						maxWidth: '90%',
						boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
					}}>
						<h2 style={{ color: 'white', marginTop: 0, marginBottom: '20px' }}>
							{canCreateDirectly ? 'Create New Breed' : 'Suggest New Breed'}
						</h2>
						
						{submitError && (
							<div style={{ background: '#ff555520', color: '#ff5555', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>
								{submitError}
							</div>
						)}

						<form onSubmit={handleCreate}>
							<div style={{ marginBottom: '15px' }}>
								<label style={{ display: 'block', color: '#aaa', marginBottom: '5px' }}>English Name (Required)</label>
								<input 
									type="text" 
									value={breedNameEn} 
									onInput={(e: any) => setBreedNameEn(e.target.value)}
									placeholder="e.g. Golden Retriever"
									style={{
										width: '100%', padding: '10px', borderRadius: '8px',
										border: '1px solid #333', background: '#000', color: 'white',
										boxSizing: 'border-box'
									}}
								/>
							</div>
							
							<div style={{ marginBottom: '25px' }}>
								<label style={{ display: 'block', color: '#aaa', marginBottom: '5px' }}>Ukrainian Name (Optional)</label>
								<input 
									type="text" 
									value={breedNameUk} 
									onInput={(e: any) => setBreedNameUk(e.target.value)}
									placeholder="напр. Золотистий ретривер"
									style={{
										width: '100%', padding: '10px', borderRadius: '8px',
										border: '1px solid #333', background: '#000', color: 'white',
										boxSizing: 'border-box'
									}}
								/>
							</div>

							<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
								<button 
									type="button" 
									onClick={() => setIsModalOpen(false)}
									style={{
										background: 'transparent', color: '#aaa', border: 'none',
										padding: '10px 15px', cursor: 'pointer'
									}}
								>
									Cancel
								</button>
								<button 
									type="submit"
									disabled={createBreedMutation.isPending || submitAppMutation.isPending}
									style={{
										background: '#4CAF50', color: 'white', border: 'none',
										padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
										fontWeight: 'bold', opacity: (createBreedMutation.isPending || submitAppMutation.isPending) ? 0.7 : 1
									}}
								>
									{createBreedMutation.isPending || submitAppMutation.isPending ? 'Saving...' : 'Save'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</DashboardLayout>
	);
}
