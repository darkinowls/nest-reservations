import { postFetch } from './tools';

describe('Reservations checks', () => {


	// Create it if not exists
	const user = {
		email: 'string@example.com',
		password: 'stringS1!'
	};

	const reservationInput = {
		'startDate': '2024-05-22T06:02:14.697Z',
		'endDate': '2024-05-22T06:02:14.697Z',
		'placeId': 'string',
		'invoiceId': 'string'
	};

	let reservationOutput: NonNullable<any>;

	let cookie: string | null;

	beforeEach(async () => {
		await postFetch('http://localhost:3010/users', user);
		const res = await postFetch('http://localhost:3010/auth/local', user);
		expect(res.status).toBe(201);
		expect(res.headers.get('set-cookie')).toBeDefined();
		expect((await res.json()).email).toBe(user.email);
		cookie = res.headers.get('set-cookie');
	});

	it('should create a reservation', async () => {

		const res = await fetch('http://localhost:3000/reservations', {
			body: JSON.stringify(reservationInput),
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Cookie': cookie || ''
			},
			credentials: 'include'
		});

		const data = await res.json();

		expect(res.status).toBe(201);

		expect(data).toMatchObject(reservationInput);

		reservationOutput = data;
		delete reservationOutput.approvalLink;

	});

	it('should get reservations', async () => {
		const res = await fetch('http://localhost:3000/reservations');
		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data.length).toBeGreaterThan(0);
		expect(data).toContainEqual(reservationOutput);
	});

	it('should get the reservation', async () => {
		const res = await fetch(`http://localhost:3000/reservations/${reservationOutput._id}`);
		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data).toMatchObject(reservationOutput);
	});

});