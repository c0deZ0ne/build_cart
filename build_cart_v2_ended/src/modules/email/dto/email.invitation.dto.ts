import { CreateInvitationDto } from 'src/modules/invitation/dto/create-invitation.dto';

export class InvitationNotificationDto extends CreateInvitationDto {
  constructor() {
    super();
  }
  invitationId: string;
}
