import { INestApplication } from '@nestjs/common';

let app: INestApplication

const setApp = (appInstance: INestApplication) => {
	app = appInstance
}

export {app, setApp}