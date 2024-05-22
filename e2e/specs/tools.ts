export const postFetch = async (url: string, body: any) => {
	return await fetch(url, {
		body: JSON.stringify(body),
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	});
};