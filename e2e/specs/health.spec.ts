import { ping } from 'tcp-ping';

describe('check health', () => {

	it('should be healthy Reservations', async () => {
		const res = await fetch('http://localhost:3000/health');
		expect(res.status).toBe(200);
	});

	it('should be healthy Auth', async () => {
		const res = await fetch('http://localhost:3010/health');
		expect(res.status).toBe(200);
	});

	it('should be healthy Payments', (done) => {
		ping({ address: 'localhost', port: 3021 }, function(err, data) {
			expect(err).toBe(undefined);
			expect(data.avg).toBeGreaterThan(0);
			done()
		});
	});

	it('should be healthy Notifications', (done) => {
		ping({ address: 'localhost', port: 3031 }, function(err, data) {
			expect(err).toBe(undefined);
			expect(data.avg).toBeGreaterThan(0);
			done()
		});
	});
});
