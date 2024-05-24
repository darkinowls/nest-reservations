import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotifyUserDto } from '@app/common/dto/notifyUser.dto';
import {
	NotificationsServiceController,
	NotificationsServiceControllerMethods,
	ResponseMesssage
} from '@app/common/proto/notifications';

@Controller()
@NotificationsServiceControllerMethods()
export class NotificationsController implements NotificationsServiceController {
	constructor(private readonly notificationsService: NotificationsService) {
	}

	@Get()
	async getHello() {
		console.log('THE notification microservice is mocked!');
		return this.notificationsService.notifyUser({
			message: 'Hello World!',
			subject: 'rest api test',
			email: 'user@example.com'
		});
	}

	async notifyUser(data: NotifyUserDto): Promise<ResponseMesssage> {
		console.log(data);
		console.log('THE notification microservice is mocked!');
		return {
			response: await this.notificationsService.notifyUser(data)
		};
	}

}
