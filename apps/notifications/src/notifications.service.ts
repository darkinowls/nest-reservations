import { Injectable } from '@nestjs/common';
import { NotifyUserDto } from '@app/common/dto/notifyUser.dto';
import { Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {

	constructor(private readonly configService: ConfigService) {
	}

	private readonly transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: this.configService.getOrThrow('EMAIL_USER'),
			clientId: this.configService.getOrThrow('EMAIL_CLIENT_ID'),
			clientSecret: this.configService.getOrThrow('EMAIL_CLIENT_SECRET'),
			refreshToken: this.configService.getOrThrow('EMAIL_REFRESH_TOKEN')
		}
	});
	private readonly logger = new Logger(NotificationsService.name);

	async notifyUser(data: NotifyUserDto) {
		await this.transporter.sendMail({
			from: this.configService.getOrThrow('EMAIL_USER'),
			to: this.configService.getOrThrow('EMAIL_USER'),
			subject: data.subject,
			text: data.message
		});
		this.logger.debug(`Sending notification to ${data.email}: ${data.message}`);
		return 'Notification sent';
	}
}
